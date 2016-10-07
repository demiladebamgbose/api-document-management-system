var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var models = require('./app/models/index');
var router = express.Router();
var routes = require('./app/routes/role-route');

routes(router);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', router);

app.get('/', function(req, res){
  res.json({
    message: 'rooot route'
  });
});

app.post('/users', function (req, res) {
  models.User.create({
    emailaddress: req.body.emailaddress,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    RoleId: req.body.RoleId
  }).then(function (user) {
    res.json(user);
  });
});



app.listen('8080', function () {
  console.log ('app started on port 8080');
});
