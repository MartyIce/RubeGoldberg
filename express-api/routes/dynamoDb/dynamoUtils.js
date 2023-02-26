const AWSDynamoDb = require("@aws-sdk/client-dynamodb");

buildUpdateCommand = function (table, pk, sk, payload, types) {

    let updateExpression = ''
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    let fields = Object.keys(types);
    for(let i = 0; i < fields.length; i++) {
        let field = fields[i].toLowerCase();
        
        if(updateExpression.length > 0) {
            updateExpression += ', ';
        } else {
            updateExpression += 'set ';
        }
        updateExpression += `#${field} = :${field}`

        expressionAttributeNames[`#${field}`] = `${fields[i]}`;
        expressionAttributeValues[`:${field}`] = {};

        let type = types[fields[i]] ?? "S";
        expressionAttributeValues[`:${field}`][type] = payload[Object.keys(payload).find(key => key.toLowerCase() === field)]
    }

    var ret = new AWSDynamoDb.UpdateItemCommand({
        TableName: table,
        Key: {
          "PK": { S: pk },
          "SK": { S: sk },
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames, 
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
      });
    
    console.log('UpdateItemCommand:', JSON.stringify(ret));
    
    return ret;
};

module.exports = {
    buildUpdateCommand: buildUpdateCommand
};
