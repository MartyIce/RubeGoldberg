var express = require('express');
var router = express.Router();
var { ddbClient } = require('../../dynamodb/ddbClient');
const AWSDynamoDb = require("@aws-sdk/client-dynamodb");
var { execute, tryCatch, sOrBlank } = require('./utils');
const KSUID = require('ksuid')

eCommerceTableName = "ECommerceTable";

mapCustomer = (raw) => {
  if (!raw) return {};
  let items = raw.Items;
  if (!items && raw.Attributes) {
    items = [raw.Attributes];
  }
  if (!items) return {};

  let ret = items.map(i => {
    return {
      username: sOrBlank(i.Username),
      name: sOrBlank(i.Name),
      email: sOrBlank(i['Email Address']),
      addresses: i.Addresses ? JSON.parse(i.Addresses.S) : []
    }
  });
  return ret;
}

execCustomerRet = (cmd, raw, res) => {
  return tryCatch(() => ddbClient.send(cmd, (err, data) => execute(err, raw ? data : mapCustomer(data), res)));
}

// Get All Raw
router.get('', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: eCommerceTableName,
  });
  await tryCatch(() => ddbClient.send(getItems, (err, data) => execute(err, data, res)));
});

// Get Customers
router.get('/customers', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: eCommerceTableName,
    FilterExpression: "begins_with(PK, :pk) AND begins_with(SK, :pk) ",
    ExpressionAttributeValues: {
      ":pk": { "S": "CUSTOMER#" }
    }
  });
  await execCustomerRet(getItems, req.query.raw, res);
});

customerByUsername = async (username, exec) => {
  const getCustomer = new AWSDynamoDb.QueryCommand({
    TableName: eCommerceTableName,
    KeyConditionExpression: "#PK = :username AND #SK = :username",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK"
    },
    ExpressionAttributeValues: {
      ":username": { "S": `CUSTOMER#${username}` }
    }
  });
  await ddbClient.send(getCustomer, exec);
}
// Get Customer By Username
router.get('/customers/:username', async function (req, res, next) {
  await customerByUsername(req.params.username,
    (err, data) => {
      execute(err, req.query.raw ? data : mapCustomer(data), res)
    });
});

router.post('/customers', async function (req, res, next) {

  const username = req.body.username;
  const email = req.body.email;

  const putItem = new AWSDynamoDb.TransactWriteItemsCommand({
    TransactItems: [
      {
        Put: {
          TableName: eCommerceTableName,
          ConditionExpression: "attribute_not_exists(PK) AND :actual > :check",
          ExpressionAttributeValues: {
            ':check': { 'N': 0 },
            ':actual': { 'N': username.length },
          },
          Item: {
            'PK': { 'S': `CUSTOMER#${username}` },
            'SK': { 'S': `CUSTOMER#${username}` },
            'Username': { 'S': username },
            'Email Address': { 'S': email },
            'Name': { 'S': req.body.name }
          },
        }
      },
      {
        Put: {
          TableName: eCommerceTableName,
          ConditionExpression: "attribute_not_exists(PK)",
          Item: {
            'PK': { 'S': `CUSTOMEREMAIL#${email}` },
            'SK': { 'S': `CUSTOMEREMAIL#${email}` }
          },
        }
      }
    ]
  });
  await execCustomerRet(putItem, req.query.raw, res);
});

router.put('/customers/:username', async function (req, res, next) {

  const username = req.body.username;
  const key = `CUSTOMER#${username}`;
  const updateItem = new AWSDynamoDb.UpdateItemCommand({
    TableName: eCommerceTableName,
    Key: {
      "PK": { "S": key },
      "SK": { "S": key },
    },
    UpdateExpression: "set #name = :name, #addresses = :addresses",
    ExpressionAttributeNames: {
      '#name': 'Name',
      '#addresses': 'Addresses',
    }, ExpressionAttributeValues: {
      ":name": { "S": req.body.name },
      ":addresses": { "S": JSON.stringify(req.body.addresses) }
    },
    ReturnValues: "ALL_NEW"
  });
  await execCustomerRet(updateItem, req.query.raw, res);
});

// Delete Customer by username
router.delete('/customers/:username', async function (req, res, next) {
  await customerByUsername(req.params.username,
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500)
        res.json(err);
      } else {
        try {
          if (!data || !data.Items || data.Items.length != 1) {
            res.status(404)
            res.json({ msg: "Unable to locate user" });
          }
          else {
            const email = data.Items[0]["Email Address"].S;
            const deleteItem = new AWSDynamoDb.TransactWriteItemsCommand({
              TransactItems: [
                {
                  Delete: {
                    TableName: eCommerceTableName,
                    Key: {
                      "PK": { S: `CUSTOMER#${req.params.username}` },
                      "SK": { S: `CUSTOMER#${req.params.username}` },
                    },
                  }
                },
                {
                  Delete: {
                    TableName: eCommerceTableName,
                    Key: {
                      "PK": { S: `CUSTOMEREMAIL#${email}` },
                      "SK": { S: `CUSTOMEREMAIL#${email}` },
                    },
                  }
                }
              ]
            });
            ddbClient.send(deleteItem, (err, data) => execute(err, data, res));
          }
        }
        catch (err) {
          console.log(err);
          res.status(500)
          res.json(err);
        }
      }
    });
});


router.post('/customers/:username/orders', async function (req, res, next) {

  const username = req.params.username;
  const key = `CUSTOMER#${req.params.username}`
  const orderId = await (await KSUID.random()).string;

  // const putItem = new AWSDynamoDb.PutItemCommand(request);
  // await ddbClient.send(putItem, (err, data) => execute(err, {}, res));

  try {
    const postOrder = new AWSDynamoDb.TransactWriteItemsCommand({
      TransactItems: [
        {
          Update: {
            TableName: eCommerceTableName,
            ConditionExpression: "attribute_exists(PK)",
            Key: {
              "PK": { "S": key },
              "SK": { "S": key },
            },
            UpdateExpression: "set #updated_at = :updated_at",
            ExpressionAttributeNames: {
              '#updated_at': 'UpdatedAt'
            }, ExpressionAttributeValues: {
              ":updated_at": { "S": new Date() },
            },
            ReturnValues: "ALL_NEW"
          },
        },
        {
          Put: {
            TableName: eCommerceTableName,
            Item: {
              'PK': { 'S': `CUSTOMER#${username}` },
              'SK': { 'S': `#ORDER#${orderId}` },
              'OrderId': { 'S': orderId },
              'CreatedAt': { 'S': new Date() },
              'ItemId': { 'S': req.body.item_id },
              'Status': { 'S': req.body.status },
              'Amount': { 'S': req.body.amount },
              'NumberItems': { 'N': req.body.number_items }
            },
          }
        }
      ]
    });
    await ddbClient.send(postOrder, (err, data) => execute(err, data, res));
  }
  catch (err) {
    console.log(err);
    res.status(500)
    res.json(err);
  }

});

router.get('/orders', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: eCommerceTableName,
    FilterExpression: "begins_with(PK, :pk) AND begins_with(SK, :sk) ",
    ExpressionAttributeValues: {
      ":pk": { "S": "CUSTOMER#" },
      ":sk": { "S": "#ORDER#" },
    }
  });

  await ddbClient.send(getItems, (err, data) => execute(err, data, res));
});

module.exports = router;
