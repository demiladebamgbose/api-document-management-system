var auth = require('./auth.js');
var models = require('./../models/index');
var helper = require('./helpers');
var User = {};

User.signup = function (req, res) {
  models.Users.findOne({
    where: { emailaddress: req.body.emailaddress }
  }).then (function (user) {
    if (!user) {
      validateDetails(req, res);
    } else {
      res.status(422).json({
        success: false,
        message: 'user already exists'});
    }
  }).catch (function (error) {
    res.status(500).json(error);
  });
};

var validateDetails = function (req, res) {
  helper.checkRole(req.body.RoleId).then(function (role) {
    if (role) {
      if ((helper.validateEmail(req.body.emailaddress)) &&
       (helper.validatePassWord(req.body.password))) {
        createUser(req).then(function (json) {
          res.json(json);
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid Email Address or Password'
        });
        return;
      }
    } else {
      res.status(422).json({
        success: false,
        message: 'Invalid Role for user'
      });
      return;
    }
  });
};

var createUser = function (req) {
  return models.Users.create({
    emailaddress: req.body.emailaddress,
    password: helper.hashPassword(req.body.password),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    RoleId: req.body.RoleId
  }).then (function (user) {
    var token = auth.generateToken({
      emailaddress: user.emailaddress,
      password: user.password,
      RoleId: user.RoleId,
      OwnerId: user.id
    });
    return { success: true, token: token, user:user };
  }).catch (function (error) {
    return error;
  });
};


User.login = function (req, res) {
  models.Users.findOne({
    where: {emailaddress: req.body.emailaddress}
  }).then (function (user) {
    if(!user){
      res.json({
        success: false,
        message: 'authentication failed. User not found'
      });
    } else {
      authenticate(req, res, user);
    }
  }).catch (function (error) {
    res.status(500).json(error);
  });
};

var authenticate = function (req, res, user) {
  var response = helper.comparePasswords(req.body.password, user.password);
  if (response) {
    var token = auth.generateToken({
      emailaddress: user.emailaddress,
      password: user.password,
      RoleId: user.RoleId,
      OwnerId: user.id
    });
    res.json({
      success: true,
      token: token
    });
  } else{
    res.status(403).json({
      success: false,
      message: 'authentication failed. Wrong password'
    });
  }
};

User.allUsers = function (req, res) {
  models.Users.findAll({})
  .then (function (roles) {
    res.json(roles);
  }).catch (function (error) {
    res.status(500).json(error);
  });
};

User.deleteUser = function (req, res) {
  models.Users.destroy({
    where: {id: req.params.id}
  }).then(function (user) {
    res.json(user);
  }).catch(function (error) {
    res.status(500).json(error);
  });
};

User.findAUser = function (req, res) {
  models.Users.findOne({
    where: {id: req.params.id}
  }).then(function (user) {
    res.json(user);
  }).catch(function (error) {
    res.status(500).json(error);
  });
};

User.updateUser = function (req, res) {
  models.Users.findOne({
    where: { id: req.params.id }
  }).then(function (user) {
    if (user) {
      user.updateAttributes({
        emailaddress: req.body.emailaddress,
        password: helper.hashPassword(req.body.password),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        RoleId: req.body.RoleId
      }).then(function (user) {
        var token = auth.generateToken({
          emailaddress: user.emailaddress,
          password: user.password,
          RoleId: user.RoleId,
          OwnerId: user.id
        });
        res.json({ success: true, token: token, user: user});
      }). catch(function (error) {
        res.status(500).json(error);
      });
    } else {
      res.json({
        success: false,
        message: 'Failed to update user. User does not exist'
      });
    }
  }).catch(function (error) {
    res.status(500).json(error);
  });
};

User.logout = function (req, res) {
  res.json({
    success: 'true',
    message: 'User logged out successfully'
  });
};

User.verifyToken = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    res.status(403).json({
      success:false,
      message: 'No token found. Token needed for authentication'
    });
  } else{
    auth.verifyToken(req,res, next, token);
  }
};

module.exports = User;
