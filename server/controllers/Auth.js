import jwt from 'jsonwebtoken';
import helper from './../../services/Helpers';

const secret = process.env.secret;

/** Provies methods to handle authentication */
class Auth {

  /**
  * Generates a JWT token encoding the payload
  *
  * @param {Object} payload
  * @return {String} Token
  */
  generateToken(payload) {
    return jwt.sign(payload, secret, {
      expiresIn: 60 * 60 * 24
    });
  }

  /**
  * Checks for the existence of token and decodes it.
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} next Calls next function
  * @return {void}
  */
  validateToken(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      helper.sendMessage(res, 401, 'No token found. Token needed for authentication');
    } else {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          // Send this response if token is not found or invalid
          helper.sendMessage(res, 401, 'Failed to authenticate');
        } else {
          // Attach decoded payload to request
          req.decoded = decoded;
          next();
        }
      });
    }
  }
}

export default new Auth();
