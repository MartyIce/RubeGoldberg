class ExpressClient {
    getTables = () => {
        return fetch("http://localhost:3002/dynamodb/tables")
    };
    describeTable = (tableName) => {
        return fetch(`http://localhost:3002/dynamodb/tables/${tableName}`);
    };
    createTable = (tableName, tableSchema) => {
        return fetch("http://localhost:3002/dynamodb/tables", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
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
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tableName: tableName})
          })
    };
}

export default ExpressClient;