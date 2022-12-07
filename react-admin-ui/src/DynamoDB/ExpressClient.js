class ExpressClient {

    constructor() {
      this.ch18Root = "http://localhost:3002/dynamodb/ch18/sessions"
    }

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

    // Ch 18 - sesions
    getSessions = () => {
      return fetch(this.ch18Root, {
        method: 'GET',
        headers: this.jsonHeaders
      });
    };
    postSession = (session) => {
      return fetch(this.ch18Root, {
        method: 'POST',
        headers: this.jsonHeaders,
        body: JSON.stringify(
          { 
            session: session,
          })
      });
    };
    querySessions = (keyConditionExpression, filterExpression, expressionAttributeNames, expressionAttributeValues) => {
      return fetch(`${this.ch18Root}/query`, {
        method: 'POST',
        headers: this.jsonHeaders,
        body: JSON.stringify(
          { 
            keyConditionExpression: keyConditionExpression,
            filterExpression: filterExpression,
            expressionAttributeNames: expressionAttributeNames,
            expressionAttributeValues: expressionAttributeValues
          })
      });
    };
    getUserSessions = (username) => {
      return fetch(`${this.ch18Root}/${username}`, {
        method: 'GET',
        headers: this.jsonHeaders,        
      });
    };
    deleteUserSessions = (username) => {
      return fetch(`${this.ch18Root}/${username}`, {
        method: 'DELETE',
        headers: this.jsonHeaders,        
      });
    };
}

export default ExpressClient;