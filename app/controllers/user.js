var Auth = require('./auth.js');
var models = require('./../models/index');
var helper = require('./helpers');
var User = {};

User.signup = function (req, res) {
  models.Users.findOne({
    where: {emailaddress: req.body.emailaddress}
  }).then (function (user) {
    if (!user) {
      validateDetails(req, res);
    } else {
      res.json({message: 'user already exists'});
    }
  }).catch (function (error) {
    res.json(error);
  });
};

var validateDetails = function (req, res) {
  helper.checkRole(req.body.RoleId).then(function (role) {
    if (role) {
      if ((helper.validateEmail(req.body.emailaddress)) &&
       (helper.validatePassWord(req.body.password))) {
        createUser(req, res);
      } else {
        res.json({
          success: false,
          message: 'Invalid Email Address or Password'
        });
        return;
      }
    } else {
      res.json({
        success: false,
        message: 'Invalid Role for user'
      });
      return;
    }
  });


};

var createUser = function (req, res) {
  models.Users.create({
    emailaddress: req.body.emailaddress,
    password: helper.hashPassword(req.body.password),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    RoleId: req.body.RoleId
  }).then (function (user) {
    var token = Auth.generateToken({
      emailaddress: user.emailaddress,
      password: user.password,
      RoleId: user.RoleId
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
  models.Users.findOne({
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
  var response = helper.comparePasswords(req.body.password, user.password);
  if (response) {
    var token = Auth.generateToken({
      emailaddress: user.emailaddress,
      password: user.password,
      RoleId: user.RoleId
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

User.allUsers = function (req, res) {
  models.Users.findAll({})
  .then (function (roles) {
    res.json(roles);
  }).catch (function (error) {
    res.json(error);
  });
};

User.deleteUser = function (req, res) {
  models.Users.destroy({
    where: {emailaddress: req.params.emailaddress}
  }).then(function (user) {
    res.json(user);
  }).catch(function (error) {
    res.json(error);
  });
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
