var express = require('express');
var router = express.Router();
var { ddbClient } = require('../dynamodb/ddbClient');
const AWSDynamoDb = require("@aws-sdk/client-dynamodb");

// Another way:
// const dbClient = new AWS.DynamoDB({
//   endpoint: "http://host.docker.internal:8000",
//   credentials: {
//     accessKeyId: "test",
//     secretAccessKey: "someltesocalaccesskey",
//   },
// })
// await dbClient.listTables({}, function(err, data) {
//     if (err) {
//       console.log(err)
//       res.json(err);
//     } 
//     else res.json(data);

execute = function (err, data, res) {
  if (err) {
    console.log(err)
    res.json(err);
  }
  else res.json(data);
};

router.get('/', async function (req, res, next) {
  const listTables = new AWSDynamoDb.ListTablesCommand({});
  await ddbClient.send(listTables, (err, data) => execute(err, data, res));
});

router.get('/:name', async function (req, res, next) {
  const describeTable = new AWSDynamoDb.DescribeTableCommand({ TableName: req.params.name });
  await ddbClient.send(describeTable, (err, data) => execute(err, data, res));
});

router.post('/', async function (req, res, next) {

  var createTableParams = JSON.parse(req.body.tableSchema);
  createTableParams.TableName = req.body.tableName;

  console.log(createTableParams);

  const createTable = new AWSDynamoDb.CreateTableCommand(createTableParams);
  await ddbClient.send(createTable, (err, data) => execute(err, data, res));
  /*
  data = {
  TableDescription: {
    AttributeDefinitions: [
      {
      AttributeName: "Artist", 
      AttributeType: "S"
    }, 
      {
      AttributeName: "SongTitle", 
      AttributeType: "S"
    }
    ], 
    CreationDateTime: <Date Representation>, 
    ItemCount: 0, 
    KeySchema: [
      {
      AttributeName: "Artist", 
      KeyType: "HASH"
    }, 
      {
      AttributeName: "SongTitle", 
      KeyType: "RANGE"
    }
    ], 
    ProvisionedThroughput: {
    ReadCapacityUnits: 5, 
    WriteCapacityUnits: 5
    }, 
    TableName: "Music", 
    TableSizeBytes: 0, 
    TableStatus: "CREATING"
  }
  }
  */
});

router.delete('/', async function (req, res, next) {

  if (req.body && req.body.tableName) {
    const deleteTable = new AWSDynamoDb.DeleteTableCommand({ TableName: req.body.tableName });
    await ddbClient.send(deleteTable, (err, data) => execute(err, data, res));
  }
});

module.exports = router;
