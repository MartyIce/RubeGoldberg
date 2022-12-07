var { ddbClient } = require('../dynamodb/ddbClient');
const AWSDynamoDb = require("@aws-sdk/client-dynamodb");
const fs = require( 'fs' );
const path = require( 'path' );

const SimpleMigrator = class {
    constructor() {
    }

    execute = function (err, data) {
        if (err) {
          console.log(err)
        }
        else console.json(data);
      };
    
    async migrate() {
        console.log("beginning migration")

        const templatesDir = process.cwd() + '/migration/templates';
        const files = await (await fs.promises.readdir(templatesDir)).filter(file => path.extname(file).toLowerCase() === '.json');

        const listTables = new AWSDynamoDb.ListTablesCommand({});
        const tables = await ddbClient.send(listTables);

        for( const file of files ) {
            const fromPath = path.join( templatesDir, file );
            let rawdata = fs.readFileSync(fromPath);
            let jsonData = JSON.parse(rawdata);          
            if(tables.TableNames.indexOf(jsonData['TableName']) >= 0) {
              console.log(`Table '${jsonData['TableName']}' already exists, skipping`);
            }
            else {
              const createTable = new AWSDynamoDb.CreateTableCommand(jsonData);
              await ddbClient.send(createTable, (err, data) => execute(err, data));
            }
        }

    }
  };

module.exports = SimpleMigrator;