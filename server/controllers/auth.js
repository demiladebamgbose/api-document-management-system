(() => {
  'use strict';

  const jwt = require('jsonwebtoken');
  const helper = require('./../../services/helpers');
  const secret = process.env.secret ;

  const Auth = {

    /**
    * @method generateToken
    *
    * Generates a JWT token encoding the payload
    *
    * @param {Object} payload
    * @return {String}
    */
    generateToken: (payload) => {
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
    verifyToken: (req, res, next, token) => {
      jwt.verify(token, secret, (err, decoded) => {
        if(err) {
          // Send this response if token is not found or invalid
          helper.sendMessage(res, 401, 'Failed to authenticate');
        }
        else {
          // Attach decoded payload to request
          req.decoded = decoded;
          next();
        }
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
    validateToken: (req, res, next) => {
      let token = req.body.token || req.query.token || req.headers['x-access-token'];
      if (!token) {
        helper.sendMessage(res, 403, 'No token found. Token needed for authentication');
      } else{
        Auth.verifyToken(req,res, next, token);
      }
    }
  };

  module.exports = Auth;

})();
