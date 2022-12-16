var express = require('express');
var router = express.Router();
var { ddbClient } = require('../../dynamodb/ddbClient');
const AWSDynamoDb = require("@aws-sdk/client-dynamodb");
var { execute } = require('./utils');

sessionTableName = "SessionStore";

router.post('/', async function (req, res, next) {

  let request = {
    TableName: sessionTableName,
    ConditionExpression: "attribute_not_exists(SessionToken)",
    Item: req.body.session
  };

  console.log(`request: ${JSON.stringify(request)}`);

  const putItem = new AWSDynamoDb.PutItemCommand(request);
  await ddbClient.send(putItem, (err, data) => execute(err, data, res));
});

router.get('/', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: sessionTableName
  });
  await ddbClient.send(getItems, (err, data) => execute(err, data, res));
});

router.post('/query', async function (req, res, next) {

  console.log(`request: ${JSON.stringify(req.body)}`);
  const queryParams = {
    TableName: sessionTableName
  }
  if(req.body.keyConditionExpression) {
    queryParams.KeyConditionExpression = req.body.keyConditionExpression;
  }
  if(req.body.filterExpression) {
    queryParams.FilterExpression = req.body.filterExpression;
  }
  if(req.body.expressionAttributeNames) {
    queryParams.ExpressionAttributeNames = req.body.expressionAttributeNames;
  }
  if(req.body.expressionAttributeValues) {
    queryParams.ExpressionAttributeValues = req.body.expressionAttributeValues;
  }
  const queryItems = new AWSDynamoDb.QueryCommand(queryParams);
  try {
    await ddbClient.send(queryItems, (err, data) => execute(err, data, res));
  }  
  catch (err) {
    res.status(500)
    res.json(err);
  }
});

const queryByUsername = (username, exec) => {
  const queryParams = {
    TableName: sessionTableName,
    IndexName: "Username-index",
    KeyConditionExpression: "#username = :username",
    ExpressionAttributeNames: {
    "#username": "Username"
    },
    ExpressionAttributeValues: {
    ":username": { "S": username }
    }    
  }
  const queryItems = new AWSDynamoDb.QueryCommand(queryParams);
  return ddbClient.send(queryItems, exec);
}

// Get Sessions by username
router.get('/:username', async function (req, res, next) {

  try {
    await queryByUsername(req.params.username, (err, data) => execute(err, data, res))
  }  
  catch (err) {
    res.status(500)
    res.json(err);
  }
});

// Delete Sessions by username
router.delete('/:username', async function (req, res, next) {
  try {
    await queryByUsername(req.params.username, (err, data) => {
      if (err) {
        res.status(err['$metadata'] ? err['$metadata'].httpStatusCode: 500)
        res.json(err);
      }
      else {
        console.log(`item count: ${data.Items.length}`);
        data.Items.forEach(async i => {
          console.log(`token: ${i.SessionToken}`);
          const input = {
            TableName: sessionTableName,
            Key: {
              SessionToken: i.SessionToken,
            },
          };
          const deleteItem = new AWSDynamoDb.DeleteItemCommand(input)
          await ddbClient.send(deleteItem);          
        });
        res.json({ itemCount: data.Items.length})
      }
    })
  }  
  catch (err) {
    res.status(500)
    res.json(err);
  }
});

module.exports = router;
