const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require('./config');
const TaskList = require('./routes/tasklist');
const Task = require('./models/task');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const createError = require('http-errors');

const app = express();

//Shows the views of JADE like HTML whit EXPRESS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cosmosClient = new CosmosClient({
  endpoint: config.host,
  key: config.authkey
})


const taskObj = new Task(cosmosClient, config.databaseID, config.containerId);

const taskList = new TaskList(taskObj);


taskObj.init(err => {
  console.log(err);
}).catch(err => {
  console.log(err);
  process.exit(1);
})

app.get("/", (req, res, next) => taskList.showTasks(req, res).catch(next))

app.post("/add", (req, res, next) => taskList.addTask(req, res).catch(next))

app.post("/complete", (req, res, next)=>taskList.completeTask(req, res).catch(next))

//handele a 404
app.use(function (req, res, next) {
  // const error = new Error("Not Found")
  // error.status = 404;
  next(createError(404));
})


module.exports = app;
// let createError = require('http-errors');
// let express = require('express');
// let path = require('path');
// let cookieParser = require('cookie-parser');
// let logger = require('morgan');

// let indexRouter = require('./routes/index');
// let usersRouter = require('./routes/users');

// let app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
