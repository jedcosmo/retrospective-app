// Babel ES6/JSX Compiler
require('babel-register');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var mongoose = require('mongoose');
var _ = require('underscore');

var config = require('./config');
var routes = require('./app/routes');
var RetrospectiveRouter = require('./routes/retrospective');

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var SocketManager = require('./managers/socketManager');
var retroPdf = require('./managers/retroPdf');

app.io = io;

var socketManagerInstance = new SocketManager(io);

socketManagerInstance.setupManager(io);
retroPdf.setupRetroPdf(app);

mongoose.Promise = global.Promise;
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
  process.exit(1);
});
mongoose.connection.on('open', function() {
  console.log('MongoDB connected.');
});

app.set('port', process.env.PORT || 3000);

if(process.env.NODE_ENV !== 'test'){
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/retrospectives', RetrospectiveRouter);

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = server;
