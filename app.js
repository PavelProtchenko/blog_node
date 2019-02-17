const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const config = require('./config');
const routes = require('./routes');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// express
const app = express();

// sessions
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

// router
app.get('/', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  res.render('index', {
    user: {
      id,
      login
    }
  });
});
app.use('/api/auth', routes.auth);

// catch 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {},
    title: 'Ooops...'
  });
});