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

module.exports = router;
