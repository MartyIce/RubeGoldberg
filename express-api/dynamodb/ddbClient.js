const AWS = require("@aws-sdk/client-dynamodb");

const ddbClient = new AWS.DynamoDBClient({
    region: "us-east-2",
    endpoint: "http://host.docker.internal:8000",
    sslEnabled: false,
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "someltesocalaccesskey",
    },
  });

module.exports = { ddbClient };
