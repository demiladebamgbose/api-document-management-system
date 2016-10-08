var Auth = require('./auth.js');
var models = require('./../models/index');
var User = {};

User.signup = function (req, res) {
  models.User.findOne({
    where: {emailaddress: req.body.emailaddress}
  }).then (function (user) {
    if (!user) {
      createUser(req, res);
    } else {
      res.json({message: 'user already exists'});
    }
  }).catch (function (error) {
    res.json(error);
  });
};

var createUser = function (req, res) {
  models.User.create({
    emailaddress: req.body.emailaddress,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    RoleId: req.body.RoleId
  }).then (function (user) {
    var token = Auth.generateToken({
      emailaddress: user.emailaddress,
      password: user.passworssd
    });
    res.json({
      success: true,
      token: token,
      user:user
    });
  }).catch (function (error) {
    res.json(error);
  });
};


User.login = function (req, res) {
  models.User.findOne({
    where: {emailaddress: req.body.emailaddress}
  }).then (function (user) {
    if(!user){
      res.json({
        success: false,
        message: 'Authentication failed. User not found'
      });
    } else {
      authenticate(req, res, user);
    }
  }).catch (function (error) {
    res.json(error);
  });
};

var authenticate = function (req, res, user) {
  if (user.password === req.body.password) {
    var token = Auth.generateToken({
      emailaddress: user.emailaddress,
      password: user.password
    });
    res.json({
      success: true,
      token: token
    });
  } else{
    res.json({
      success: false,
      message: 'Authentication failed. Wrong password'
    });
  }
};

User.verifyToken = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    res.status('403').json({
      success:false,
      message: 'No token found. Token needed for Authentication'
    });
  }
  else{
    Auth.verifyToken(req,res, next, token);
  }
};

module.exports = User;
