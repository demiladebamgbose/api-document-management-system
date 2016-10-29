(function () {
  'use strict';

  var auth = require('./auth.js');
  var models = require('./../models/index');
  var helper = require('./helpers');

  //User controller methods
  var User = {

    /**
    * @method signup
    *
    * Creates a new user and saves into the database
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    signup: function (req, res) {
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
    },

    /**
    * @method login
    *
    * Logs a user in and generates token
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    login: function (req, res) {
      models.Users.findOne({
        where: {emailaddress: req.body.emailaddress}
      }).then (function (user) {
        if(!user){
          res.status(404).json({
            success: false,
            message: 'authentication failed. User not found'
          });
        } else {
          authenticate(req, res, user);
        }
      }).catch (function (error) {
        res.status(500).json(error);
      });
    },

    /**
    * @method allUsers
    *
    * Retrieves all the users from the database
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    allUsers: function (req, res) {
      models.Users.findAll({})
      .then (function (roles) {
        res.json(roles);
      }).catch (function (error) {
        res.status(500).json(error);
      });
    },

    /**
    * @method deleteUser
    *
    * Deletes a user from the database based on params.id
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    deleteUser: function (req, res) {
      models.Users.destroy({
        where: {id: req.params.id}
      }).then(function (user) {
        res.json(user);
      }).catch(function (error) {
        res.status(500).json(error);
      });
    },

    /**
    * @method findAUser
    *
    * Finds one user based on params.id from the database
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    findAUser: function (req, res) {
      models.Users.findOne({
        where: {id: req.params.id}
      }).then(function (user) {
        if (user) {
          res.json(user);
        } else {
          res.status(400).json({
            success: false,
            message: 'User does not exit'
          });
        }
      }).catch(function (error) {
        res.status(500).json(error);
      });
    },

    /**
    * @method updateUser
    *
    * Updates all or some of the attributes of the user
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    updateUser: function (req, res) {
      if (checkAccess(req)) {
        models.Users.findOne({
          where: { id: req.params.id }
        }).then(function (user) {
          theUpdater(req, res, user);
        }).catch(function (error) {
          res.status(500).json(error);
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Oops! user details are not yours to edit'
        });
      }
    },

    /**
    * @method logout
    *
    * Logs a user out.
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    logout: function (req, res) {
      res.json({
        success: 'true',
        message: 'User logged out successfully'
      });
    },

    /**
    * @method verifyToken
    *
    * Checks for the existence of token and decodes it.
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    verifyToken: function (req, res, next) {
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
      if (!token) {
        res.status(403).json({
          success:false,
          message: 'No token found. Token needed for authentication'
        });
      } else{
        auth.verifyToken(req,res, next, token);
      }
    }
  };

  /**
  * @method theUpdater
  *
  * Updates all or some of the attributes of the document
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} user user to be upated
  * @return {Void}
  */
  function theUpdater (req, res, user) {
    user.updateAttributes({
      emailaddress: req.body.emailaddress,
      password: helper.hashPassword(req.body.password),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      RoleId: req.body.RoleId
    }, { fields: Object.keys(req.body) }).then(function (user) {
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
  }

  /**
  * @method checkAccess
  *
  * Checks if a user has access to update user details
  *
  * @param {Object} req An instance of request
  * @return {Void}
  */
  function checkAccess (req) {
    //eslint-disable-next-line
    if (req.decoded.OwnerId == req.params.id) {
      return true;
    }
    return false;
  }

  /**
  * @method authenticate
  *
  * Conpares password on login.
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} user
  * @return {Void}
  */
  function authenticate (req, res, user) {
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
        token: token,
        user: user
      });
    } else{
      res.status(403).json({
        success: false,
        message: 'authentication failed. Wrong password'
      });
    }
  }

  /**
  * @method createUser
  *
  * Creates a new user and new user and saves it to the database on signup
  *
  * @param {Object} req An instance of request
  * @return {Void}
  */
  function createUser (req) {
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
  }

  /**
  * @method validateDetails
  *
  * Ensures input fields are not empty before creating a user
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  function validateDetails (req, res) {
    helper.checkRole(req.body.RoleId).then(function (role) {
      if (role) {
        if (helper.validateRequestBody(req.body)) {
          if ( (helper.validateEmail(req.body.emailaddress)) &&
           (helper.validatePassWord(req.body.password))) {
            createUser(req).then(function (json) {
              res.json(json);
            });
          } else {
            res.status(422).json({
              success: false,
              message: 'Invalid Email Address or Password'
            });
            return;
          }
        } else {
          res.status(422).json({
            success: false,
            message: 'Missing fields. Feilds cannot be empty'
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
  }

  module.exports = User;
  
})();
