var jwt = require('jsonwebtoken');
var secret = require('./../../config/config').secret;

var Auth = {};

Auth.generateToken = function (payload) {
  return jwt.sign(payload, secret, {
    expiresIn: 60*60*24
  });
};

Auth.verifyToken = function (req, res, next, token) {
  jwt.verify(token, secret, function(err, decoded) {
    if(err) {
      return res.json({success: false, message: 'Failed to authenticate'});
    }
    else {
      req.decoded = decoded;
      next();
    }
  });
};

module.exports = Auth;
