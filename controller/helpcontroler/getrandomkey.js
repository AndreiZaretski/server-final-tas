 const keyArray = require('./keyarray');
module.exports = function(){
  

  return keyArray[Math.floor(Math.random() * keyArray.length)]
}
