var express = require('express');
var router = express.Router();
var { ddbClient } = require('../../dynamodb/ddbClient');
const AWSDynamoDb = require("@aws-sdk/client-dynamodb");

execute = function (err, data, res) {
  if (err) {
    console.log(err)
    res.status(err['$metadata'].httpStatusCode)
    res.json(err);
  }
  else res.json(data);
};

router.post('/', async function (req, res, next) {

  let request = {
    TableName: req.body.tableName,
    ConditionExpression: req.body.conditionExpression,
    Item: req.body.item
  };

  console.log(`request: ${JSON.stringify(request)}`);

  const putItem = new AWSDynamoDb.PutItemCommand(request);
  await ddbClient.send(putItem, (err, data) => execute(err, data, res));
});

router.post('/list', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: req.body.tableName
  });
  await ddbClient.send(getItems, (err, data) => execute(err, data, res));
});

router.post('/query', async function (req, res, next) {

  console.log(`request: ${JSON.stringify(req.body)}`);
  const queryParams = {
    TableName: req.body.tableName
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

module.exports = router;
