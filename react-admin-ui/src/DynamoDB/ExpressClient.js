class ExpressClient {

    jsonHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    getTables = () => {
        return fetch("http://localhost:3002/dynamodb/tables")
    };
    describeTable = (tableName) => {
        return fetch(`http://localhost:3002/dynamodb/tables/${tableName}`);
    };
    createTable = (tableName, tableSchema) => {
        return fetch("http://localhost:3002/dynamodb/tables", {
            method: 'POST',
            headers: this.jsonHeaders,
            body: JSON.stringify(
              { 
                tableName: tableName,
                tableSchema: tableSchema,
              })
          })
    };
    deleteTable = (tableName) => {
        return fetch("http://localhost:3002/dynamodb/tables", {
            method: 'DELETE',
            headers: this.jsonHeaders,
            body: JSON.stringify({ tableName: tableName})
          })
    };
    getItems = (tableName) => {
      return fetch("http://localhost:3002/dynamodb/items/list", {
        method: 'POST',
        headers: this.jsonHeaders,
        body: JSON.stringify({ tableName: tableName})
      });
    };
    postItem = (tableName, item, conditionalExpression) => {
      return fetch("http://localhost:3002/dynamodb/items", {
        method: 'POST',
        headers: this.jsonHeaders,
        body: JSON.stringify(
          { 
            tableName: tableName,
            item: item,
            conditionExpression: conditionalExpression
          })
      });
    };
    queryItems = (tableName, keyConditionExpression, filterExpression, expressionAttributeNames, expressionAttributeValues) => {
      return fetch("http://localhost:3002/dynamodb/items/query", {
        method: 'POST',
        headers: this.jsonHeaders,
        body: JSON.stringify(
          { 
            tableName: tableName,
            keyConditionExpression: keyConditionExpression,
            filterExpression: filterExpression,
            expressionAttributeNames: expressionAttributeNames,
            expressionAttributeValues: expressionAttributeValues
          })
      });
    };
}

export default ExpressClient;