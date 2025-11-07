require('dotenv').config();
require('./models/connection');

const cors = require('cors');
const session = require('express-session'); 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bookingRouter = require('./routes/booking');
var tripsRouter = require('./routes/trip');
var cartRouter = require('./routes/cart.js');

var app = express();


app.use(cors({
  origin: 'http://127.0.0.1:5500', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));


app.use(session({
  secret: 'tickethack-secret-key-change-in-production', 
  resave: false,
  saveUninitialized: false,
  name: 'tickethack.sid',
  cookie: { 
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/booking', bookingRouter);
app.use('/trip', tripsRouter);
app.use('/cart', cartRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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