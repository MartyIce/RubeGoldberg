var express = require('express');
var router = express.Router();
var { ddbClient } = require('../../dynamodb/ddbClient');
const AWSDynamoDb = require("@aws-sdk/client-dynamodb");
var { execute, tryCatch, sOrBlank, nOrBlank } = require('./utils');
var { buildUpdateCommand } = require('./dynamoUtils')
const KSUID = require('ksuid')

eCommerceTableName = "ECommerceTable";

mapItem = (raw, map, skipCount) => {
  if (!raw) return {};
  let items = Array.isArray(raw) ? raw : raw.Items;
  if (!items && raw.Attributes) {
    items = [raw.Attributes];
  }
  if (!items) return {};

  return items.slice(skipCount ?? 0).map(i => map(i));
}

mapCustomer = (raw) => {
  return mapItem(raw, (i) => {
    return {
      username: sOrBlank(i.Username),
      name: sOrBlank(i.Name),
      email: sOrBlank(i['Email Address']),
      addresses: i.Addresses ? JSON.parse(i.Addresses.S) : []
    }
  });
}

mapOrder = (raw, offset) => {
  return mapItem(raw, (i) => {
    return {
      customer: i.PK.S.replace("CUSTOMER#", ""),
      orderId: sOrBlank(i.OrderId),
      createdAt: sOrBlank(i.CreatedAt),
      status: sOrBlank(i.Status),
      amount: sOrBlank(i.Amount),
      numberItems: nOrBlank(i.NumberItems),
    }
  }, offset);
}

mapOrderItem = (raw) => {
  return mapItem(raw, (i) => {
    return {
      orderId: sOrBlank(i.OrderId),
      itemId: sOrBlank(i.ItemId),
      description: sOrBlank(i.Description),
      price: nOrBlank(i.Price),
    }
  });
}

mapOrderAndOrderItems = (raw) => {
  return {
    order: mapOrder([raw.Items[raw.Items.length - 1]])[0],
    orderItems: mapOrderItem(raw.Items.slice(0, raw.Items.length - 1)),
  }
}

execCustomerRet = (cmd, raw, res) => {
  return tryCatch(() => ddbClient.send(cmd, (err, data) => execute(err, raw ? data : mapCustomer(data), res)));
}

execOrdersRet = (cmd, raw, res, offset) => {
  return tryCatch(() => ddbClient.send(cmd, (err, data) => execute(err, raw ? data : mapOrder(data, offset ?? 0), res)));
}

execOrderRet = (cmd, raw, res, offset) => {
  return tryCatch(() => ddbClient.send(cmd, (err, data) => execute(err, raw ? data : mapOrderAndOrderItems(data, offset ?? 0), res)));
}

execWithMapping = (cmd, raw, res, map) => {
  return tryCatch(() => ddbClient.send(cmd, (err, data) => execute(err, raw ? data : map(data), res)));
}

// GET All Raw
router.get('', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: eCommerceTableName,
  });
  await tryCatch(() => ddbClient.send(getItems, (err, data) => execute(err, data, res)));
});

// GET Customers
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

// GET Customer By Username
router.get('/customers/:username', async function (req, res, next) {
  await customerByUsername(req.params.username,
    (err, data) => {
      execute(err, req.query.raw ? data : mapCustomer(data), res)
    });
});

// POST new customer
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

// PUT update customer
router.put('/customers/:username', async function (req, res, next) {

  const username = req.body.username;
  const key = `CUSTOMER#${username}`;

  const updateItem = buildUpdateCommand(
    eCommerceTableName, key, key,
    {
      name: req.body.name,
      addresses: JSON.stringify(req.body.addresses)
    },
    {
      'Name': "S",
      'Addresses': "S",
    }
  );

  /*
  new AWSDynamoDb.UpdateItemCommand({
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
  */

  await execCustomerRet(updateItem, req.query.raw, res);
});

// DELETE Customer by username
router.delete('/customers/:username', async function (req, res, next) {

  // TODO - delete orders
  // https://stackoverflow.com/questions/49684100/delete-large-data-with-same-partition-key-from-dynamodb

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

// POST create customer order
router.post('/customers/:username/orders', async function (req, res, next) {

  const username = req.params.username;
  const key = `CUSTOMER#${req.params.username}`
  const orderId = await (await KSUID.random()).string;

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
              'GSIPK': { 'S': `ORDER#${orderId}` },
              'GSISK': { 'S': `ORDER#${orderId}` },
              'OrderId': { 'S': orderId },
              'CreatedAt': { 'S': new Date() },
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

// GET all orders
router.get('/orders', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: eCommerceTableName,
    FilterExpression: "begins_with(PK, :pk) AND begins_with(SK, :sk) ",
    ExpressionAttributeValues: {
      ":pk": { "S": "CUSTOMER#" },
      ":sk": { "S": "#ORDER#" },
    }
  });

  await execOrdersRet(getItems, req.query.raw, res);
});

// GET order by id
router.get('/orders/:orderId', async function (req, res, next) {
  const getItems = new AWSDynamoDb.QueryCommand({
    TableName: eCommerceTableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#gsipk = :gsipk',
    ExpressionAttributeNames: {
      '#gsipk': 'GSIPK'
    },
    ExpressionAttributeValues: {
      ':gsipk': { 'S': `ORDER#${req.params.orderId}` } 
    }
  });

  await execOrderRet(getItems, req.query.raw, res);
});

// DELETE Order by id
router.delete('/orders/:orderId', async function (req, res, next) {
  const deleteItem = new AWSDynamoDb.DeleteItemCommand({
    TableName: eCommerceTableName,
    Key: {
      "PK": { S: `CUSTOMER#${req.params.username}` },
      "SK": { S: `#ORDER#${req.params.orderId}` },
    },
  });

  await execOrdersRet(deleteItem, req.query.raw, res);
});

// GET Returns first X orders (by date desc)
router.get('/customers/:username/orders', async function (req, res, next) {

  let limit = (req.query.orderCount ?? 5) + 1;

  const getItems = new AWSDynamoDb.QueryCommand({
    TableName: eCommerceTableName,
    KeyConditionExpression: '#pk = :pk',
    ExpressionAttributeNames: {
      '#pk': 'PK'
    },
    ExpressionAttributeValues: {
      ':pk': { 'S': `CUSTOMER#${req.params.username}` }
    },
    ScanIndexForward: false,
    Limit: limit
  });

  await execOrdersRet(getItems, req.query.raw, res, 1);
});

// PUT update order 
router.put('/orders/:orderId', async function (req, res, next) {

  const updateItem = buildUpdateCommand(
    eCommerceTableName,
    `CUSTOMER#${req.params.username}`,
    `#ORDER#${req.params.orderId}`,
    req.body,
    {
      'Status': "S",
      'Amount': "S",
      'NumberItems': "N",
    }
  );
  /*
  new AWSDynamoDb.UpdateItemCommand({
    TableName: eCommerceTableName,
    Key: {
      "PK": { S: `CUSTOMER#${req.params.username}` },
      "SK": { S: `#ORDER#${req.params.orderId}` },
    },
    UpdateExpression: "set #status = :status, #amount = :amount, #numberitems = :numberitems",
    ExpressionAttributeNames: {
      '#status': 'Status',
      '#amount': 'Amount',
      '#numberitems': 'NumberItems',
    }, ExpressionAttributeValues: {
      ":status": { "S": req.body.status },
      ":amount": { "S": req.body.amount },
      ":numberitems": { "N": req.body.numberItems },
    },
    ReturnValues: "ALL_NEW"
  });
  */
  await execOrdersRet(updateItem, req.query.raw, res);
});

// POST create order item
router.post('/orders/:orderId/orderItems', async function (req, res, next) {

  const orderId = req.params.orderId;
  const orderItemId = await (await KSUID.random()).string;
  const key = `ORDER#${orderId}#ITEM#${orderItemId}`

  try {
    const postOrder = new AWSDynamoDb.TransactWriteItemsCommand({
      TransactItems: [
        {
          Put: {
            TableName: eCommerceTableName,
            Item: {
              'PK': { 'S': key },
              'SK': { 'S': key },
              'GSIPK': { 'S': `ORDER#${orderId}` },
              'GSISK': { 'S': `ITEM#${orderItemId}` },
              'OrderId': { 'S': orderId },
              'ItemId': { 'S': orderItemId },
              'Description': { 'S': req.body.description },
              'Price': { 'N': req.body.price },
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

// GET all order items
router.get('/orderitems', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: eCommerceTableName,
    FilterExpression: "begins_with(PK, :pk) AND begins_with(SK, :sk) ",
    ExpressionAttributeValues: {
      ":pk": { "S": "ORDER#" },
      ":sk": { "S": "ORDER#" },
    }
  });

  await execWithMapping(getItems, req.query.raw, res, mapOrderItem);
});

module.exports = router;
