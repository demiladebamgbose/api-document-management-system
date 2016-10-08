var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var models = require('./app/models/index');
var morgan = require('morgan');
var config = require('./config');
var jwt = require('jsonwebtoken');

app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

require('./app/routes/user-route')(app);
require('./app/routes/role-route')(app);

app.get('/', function(req, res){
  res.json({
    message: 'rooot route'
  });
});

app.listen('8080', function () {
  console.log ('app started on port 8080');
});
