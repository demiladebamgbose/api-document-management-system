var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

require('./app/routes/user-route')(app);
require('./app/routes/role-route')(app);

app.get('/', function(req, res){
  res.json({
    message: 'root route'
  });
});

app.listen(port, function () {
  console.log ('app started on port'+ port);
});

module.exports = app;
