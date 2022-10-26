var express = require('express');
const AWS = require("aws-sdk");
var router = express.Router();

AWS.config.update({region:'us-east-1'});
const dbClient = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
})

/* GET users listing. */
router.get('/', async function(req, res, next) {
  await dbClient.listTables({}, function(err, data) {
      if (err) res.json(err);
      else res.json(data);
    });
});

module.exports = router;
