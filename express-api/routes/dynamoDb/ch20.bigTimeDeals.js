var express = require('express');
var router = express.Router();
var { ddbClient } = require('../../dynamodb/ddbClient');
const AWSDynamoDb = require("@aws-sdk/client-dynamodb");
var { execute, tryCatch, sOrBlank, nOrBlank, mapItem } = require('./utils');
var { buildUpdateCommand } = require('./dynamoUtils')
const KSUID = require('ksuid')

tableName = "BigTimeDeals";

mapDeal = (raw) => {
  var items = mapItem(raw, (i) => {
    return {
      id: sOrBlank(i.DealId),
      createdAt: sOrBlank(i.CreatedAt),
      title: sOrBlank(i.Title),
      link: sOrBlank(i.Link),
      price: nOrBlank(i.Price),
      category: sOrBlank(i.Category),
      brand: sOrBlank(i.Brand)
    }
  });


  return {
    items: items,
    last_evaluated_key: raw.LastEvaluatedKey?.GSISK.S
  };
}

execDealRet = (cmd, raw, res) => {
  return tryCatch(() => ddbClient.send(cmd, (err, data) => execute(err, raw ? data : mapDeal(data), res)));
}

// GET All Raw
router.get('', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: tableName,
  });
  await tryCatch(() => ddbClient.send(getItems, (err, data) => execute(err, data, res)));
});

// GET All Deals
router.get('/deals', async function (req, res, next) {
  const getItems = new AWSDynamoDb.ScanCommand({
    TableName: tableName,
    FilterExpression: "begins_with(PK, :pk) AND begins_with(SK, :pk) ",
    ExpressionAttributeValues: {
      ":pk": { "S": "DEAL#" }
    }
  });
  await execDealRet(getItems, req.query.raw, res);
});

// POST new Deal
router.post('/deals', async function (req, res, next) {

  const dealId = await (await KSUID.random()).string;
  const createdDate = new Date();
  const truncatedTimestamp = createdDate.toLocaleDateString("en-US");
  const putItem = new AWSDynamoDb.TransactWriteItemsCommand({
    TransactItems: [
      {
        Put: {
          TableName: tableName,
          Item: {
            'PK': { 'S': `DEAL#${dealId}` },
            'SK': { 'S': `DEAL#${dealId}` },
            'GSIPK': { 'S': `DEALS#${truncatedTimestamp}` },
            'GSISK': { 'S': `DEAL#${dealId}` },
            'DealId': { 'S': dealId },
            'Title': { 'S': req.body.title },
            'Link': { 'S': req.body.link },
            'Price': { 'N': req.body.price },
            'Category': { 'S': req.body.category },
            'Brand': { 'S': req.body.brand },
            'CreatedAt': { 'S': createdDate }
          },
        }
      }
    ]
  });
  await execDealRet(putItem, req.query.raw, res);
});

router.get('/deals/:date', async function (req, res, next) {
  const truncatedTimestamp = new Date(req.params.date).toLocaleDateString("en-US");
  const cmd = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#gsipk = :gsipk AND #gsisk < :gsisk',
    ExpressionAttributeNames: {
      '#gsipk': 'GSIPK',
      '#gsisk': 'GSISK'
    },
    ExpressionAttributeValues: {
      ':gsipk': { 'S': `DEALS#${truncatedTimestamp}` },
      ':gsisk': { 'S': `DEAL#${req.params.last_seen ?? 'ZZZZZ'}` }
    },
    ScanIndexForward: false,
    Limit: req.params.limit ?? 5
  };
  const getItems = new AWSDynamoDb.QueryCommand(cmd);
  await execDealRet(getItems, req.query.raw, res);
});

// DELETE Deal by id
router.delete('/deals/:dealId', async function (req, res, next) {
  const key = `DEAL#${req.params.dealId}`;
  const deleteItem = new AWSDynamoDb.DeleteItemCommand({
    TableName: tableName,
    Key: {
      "PK": { S: key },
      "SK": { S: key },
    },
  });

  await execDealRet(deleteItem, req.query.raw, res);
});

module.exports = router;
