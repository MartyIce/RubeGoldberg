var express = require('express');
var router = express.Router();
var { ddbClient } = require('../../dynamodb/ddbClient');
const AWSDynamoDb = require("@aws-sdk/client-dynamodb");
var { execute } = require('./utils');

eCommerceTableName = "ECommerceTable";

router.get('/customers', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: eCommerceTableName
  });
  await ddbClient.send(getItems, (err, data) => execute(err, data, res));
});

router.get('/customers/:username', async function (req, res, next) {

  const queryParams = {
    TableName: eCommerceTableName,
    KeyConditionExpression: "#PK = :username",
    ExpressionAttributeNames: {
      "#PK": "PK"
    },
    ExpressionAttributeValues: {
      ":username": { "S": `CUSTOMER#${req.params.username}` }
    }
  }

  map = (raw) => {
    let ret = raw.Items.map(i => {
      return {
        username: i.Username.S,
        name: i.Name.S,
        email: i['Email Address'].S
      }
    });
    return ret;
  }

  const queryItems = new AWSDynamoDb.QueryCommand(queryParams);
  try {
    await ddbClient.send(queryItems, (err, data) => execute(err, map(data), res));
  }
  catch (err) {
    res.status(500)
    res.json(err);
  }
});

router.post('/customers', async function (req, res, next) {

  console.log(`request: ${JSON.stringify(req.body)}`);

  const username = req.body.username;
  const email = req.body.email;

  const putItem = new AWSDynamoDb.TransactWriteItemsCommand({
    TransactItems: [
      {
        Put: {
          TableName: eCommerceTableName,
          ConditionExpression: "attribute_not_exists(PK)",
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
  await ddbClient.send(putItem, (err, data) => execute(err, data, res));
});

router.put('/customers/:username', async function (req, res, next) {

  console.log(`request: ${JSON.stringify(req.body)}`);

  const username = req.body.username;
  const key = `CUSTOMER#${username}`;
  const params = {
    TableName: eCommerceTableName,
    Key: {
      "PK": { "S": key},
      "SK": { "S": key},
    },
    UpdateExpression: "set #name = :name",
    ExpressionAttributeNames: {
      '#name': 'name'
    }, ExpressionAttributeValues: {
      ":name": { "S": req.body.name }
    },
    ReturnValues: "ALL_NEW"
  }

  console.log(`params: ${JSON.stringify(params)}`);

  const updateItem = new AWSDynamoDb.UpdateItemCommand(params);
  await ddbClient.send(updateItem, (err, data) => execute(err, data, res));
});

module.exports = router;
