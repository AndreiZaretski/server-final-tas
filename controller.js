const User = require('./model/user');
const Role = require('./model/role');
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
        //console.log(req)
        return resp.status(400).json({errors}); 
      }
      const {username, userEmail, password} = req.body;
      const checkUser = await User.findOne({username});
      const checkEmail = await User.findOne({userEmail});

      if(checkUser) {
        return resp.status(400).json({message: 'This user name already exists'})
      }
      if(checkEmail) {
        return resp.status(400).json({message: 'This email already exists'})
      }
      const passwordHash = await argon2.hash(password);
      const userRole = await Role.findOne({value: 'USER'});

      const user = new User({username, userEmail, password: passwordHash, roles: [userRole.value]});
      await user.save();
      const token = generateAccesToken(user._id, user.roles);
      return resp.json({message: 'User was registration', token})
    } catch(e){
      console.error(e);
      resp.status(400).json({message: 'Registration error'})
    }
  }

  async login(req, resp) {
    try {
      
      const username = req.body?.username
      const userEmail = req.body?.userEmail
      const password = req.body?.password;
      const user = await User.findOne({$or: [ { username },  {userEmail} ]});

      if(!user) {
  
        return resp.status(400).json({message: `User ${username} not found`})
      }

      const validPassword = await argon2.verify(user.password, password);
      if(!validPassword) {
        return resp.status(400).json({ message: 'Password is incorrect'})
      }
      const token = generateAccesToken(user._id, user.roles);
      const username1 = user.username;
      return resp.json({token, username1});

    } catch(e){
      console.error(e);
      resp.status(400).json({message: 'Login error'})
    }
  }

  async loginEmail(req, resp) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(req)
        return resp.status(400).json({errors}); 
      }
      const {userEmail, password} = req.body;
      const user = await User.findOne({userEmail});


      if(!user) {
        return resp.status(400).json({message: `User ${userEmail} not found`})
      }

      const validPassword = await argon2.verify(user.password, password);
      if(!validPassword) {
        return resp.status(400).json({ message: 'Password is incorrect'})
      }
      const token = generateAccesToken(user._id, user.roles);
      const username = user.username;
      
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
    
      resp.json(users)
    } catch(e){
      console.error(e);
    }
  }

   async getUserName(req, res, next) {
    const userId = req.user?.id;
  
    if (!userId) {
      return res.status(400).json({ message: `User ${req.user.id} ID must be provided` })
    }
  
    try {
      const user = await User.findById(userId)
  
      //req.user = user
      const username = user.username;
  
      //next('route')
      res.json({username})
    } catch (e) {
      console.error(e);
      //console.log('getUser service')
      //next(e)
    }
  }

  async checkUser() {

  }

  // async logOutUser (req, resp) {
  //   //req.session.username = '';
  //   req.username = '';
  //   //const user = await User.findOne({username});
  //   req.username = '';
  //   //await resp.send(`Logged out',${resp.json(username)}`);
  //   //await resp.json({username})
  //   resp.send('Logged out')
  // }
}

module.exports = new Controller();