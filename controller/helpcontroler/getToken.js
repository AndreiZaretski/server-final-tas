const {secret} = require('../../config');
const jwt = require('jsonwebtoken');

module.exports  = function(id, roles) {
  const payload = {
   id,
   roles
  }
  return jwt.sign(payload, secret, {expiresIn: '24h'} )
}
