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
}

export default ExpressClient;