var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dynamodbTablesRouter = require('./routes/dynamoDb/schema');
var dynamodbExamplesRouter = require('./routes/dynamoDb/examples');

// Migration
let SimpleMigrator = require('./migration/simpleMigrator');
let migrator = new SimpleMigrator();
migrator.migrate()
     .then(() => {  console.log('migrated') })
     .catch((reason) => { console.log(`error during migration: ${reason}`) });

var cors = require('cors')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dynamodb/tables', dynamodbTablesRouter);
app.use('/dynamodb/items', dynamodbExamplesRouter);

module.exports = app;
