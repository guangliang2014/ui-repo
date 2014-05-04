
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var exphbs = require('express3-handlebars');
var helpers = require('./lib/helpers.js');



var app = express();

// config handlebars engine
hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: helpers,
    partialsDir: 'views/partials/'
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
