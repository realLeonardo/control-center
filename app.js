var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var home = require('./router/home');
var user = require('./router/user');
var site = require('./router/site');
var customer = require('./router/customer');
var company = require('./router/company');
var api = require('./router/api');

var app = express();

app.disable('x-powered-by');

// view engine setup
// app.set('view cache', true);
app.set('views', path.join(__dirname, 'view/pages'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json({limit: "10000kb"}));
app.use(bodyParser.urlencoded({extended: true, limit: "10000kb"}));

app.use(cookieParser()); 
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'freetes'
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/signin', user);
app.use('/site', site);
app.use('/customer', customer);
app.use('/company', company);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
