const User = require('./model/user');
const Role = require('./model/role');
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { validationResult } = require('express-validator');
const {secret} = require('./config');

const generateAccesToken = (id, roles) => {
   const payload = {
    id,
    roles
   }
   return jwt.sign(payload, secret, {expiresIn: '24h'} )
}

class Controller {
  async reg(req, resp) {
    try {
      const errors = validationResult(req);
      resp.header('Access-Control-Allow-Origin', '*');
      resp.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      if (!errors.isEmpty()) {
        console.log(req)
        return resp.status(400).json({message: 'Error registation', errors}); 
      }
      const {username, password} = req.body;
      // console.log({username, password});
      const checkUser = await User.findOne({username});
       await resp.header('Access-Control-Allow-Origin', '*');
       //"Accept": "application/json",
      // resp.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      // resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      if(checkUser) {
        return resp.status(400).json({message: 'User this name already exists'})
      }
      const passwordHash = await argon2.hash(password);
      const userRole = await Role.findOne({value: 'USER'});

      const user = new User({username, password: passwordHash, roles: [userRole.value]});
      await user.save();
      //await resp.header('Access-Control-Allow-Origin', '*');
      return resp.json({message: 'User was registration'})
    } catch(e){
      console.error(e);
      resp.status(400).json({message: 'Registration error'})
    }
  }

  async login(req, resp) {
    try {
      const {username, password} = req.body;
      const user = await User.findOne({username});

      if(!user) {
        return resp.status(400).json({message: `User ${username} not found`})
      }

      const validPassword = await argon2.verify(user.password, password);
      if(!validPassword) {
        return resp.status(400).json({ message: 'Password is incorrect'})
      }
      const token = generateAccesToken(user._id, user.roles)
      return resp.json({token, username});

    } catch(e){
      console.error(e);
      resp.status(400).json({message: 'Login error'})
    }
  }

  async getUsers(req, resp) {
    try {
      const users = await User.find()
    resp.header('Access-Control-Allow-Origin', '*');
    resp.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //resp.end()
      // const userRole = new Role();
      // const adminRole = new Role({value: 'ADMIN'});
      // await userRole.save();
      // await adminRole.save();
      resp.json(users)
    } catch(e){
      console.error(e);
    }
  }

  async logOutUser (req, resp) {
    //req.session.username = '';
    req.username = '';
    //const user = await User.findOne({username});
    req.username = '';
    //await resp.send(`Logged out',${resp.json(username)}`);
    //await resp.json({username})
    resp.send('Logged out')
  }
}

module.exports = new Controller();