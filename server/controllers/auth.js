(function () {
  'use strict';

  var jwt = require('jsonwebtoken');
  var secret = require('./../../config/config').secret || process.env.secret;

  var Auth = {

    /**
    * @method generateToken
    *
    * Generates a JWT token encoding the payload
    *
    * @param {Object} payload
    * @return {String}
    */
    generateToken: function (payload) {
      return jwt.sign(payload, secret, {
        expiresIn: 60*60*24
      });
    },

    /**
    * @method verifyToken
    *
    * Decodes JWT token and attches the decoded payload to the req object
    *
    * @param {Object} req An instance of request object
    * @param {Object} res An instance of response object
    * @param {Object} next
    * @param {String} token
    * @return {Void}
    */
    verifyToken: function (req, res, next, token) {
      jwt.verify(token, secret, function(err, decoded) {
        if(err) {
          // Send this response if token is not found or invalid
          return res.json({success: false, message: 'Failed to authenticate'});
        }
        else {
          // Attach decoded payload to request
          req.decoded = decoded;
          next();
        }
      });
    }
  };

  module.exports = Auth;

})();
