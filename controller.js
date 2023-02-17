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
      // resp.header('Access-Control-Allow-Origin', '*');
      // resp.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      // resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      if (!errors.isEmpty()) {
        //console.log(req)
        return resp.status(400).json({errors}); 
      }
      const {username, userEmail, password} = req.body;
      const checkUser = await User.findOne({username});
      const checkEmail = await User.findOne({userEmail});

      if(checkUser) {
        return resp.status(400).json({message: 'The user with this name already exists'})
      }
      if(checkEmail) {
        return resp.status(400).json({message: 'The account with this email already exists'})
      }
      const passwordHash = await argon2.hash(password);
      const userRole = await Role.findOne({value: 'USER'});

      const user = new User({username, userEmail, password: passwordHash, roles: [userRole.value]});
      await user.save();
      const token = generateAccesToken(user._id, user.roles);
      const roles = user.roles;
      return resp.json({message: 'User was registered', token, roles})
    } catch(e){
      console.error(e);
      resp.status(400).json({message: 'Registration error'});
    }
  }

  async login(req, resp) {
    try {
      
      const username = req.body?.username
      const userEmail = req.body?.userEmail
      const password = req.body?.password;
      const user = await User.findOne({$or: [ { username },  {userEmail} ]});

      if(!user) {
  
        return resp.status(400).json({message: `User ${username || userEmail} not found`})
      }

      const validPassword = await argon2.verify(user.password, password);
      if(!validPassword) {
        return resp.status(400).json({ message: 'Password is incorrect'})
      }
      const token = generateAccesToken(user._id, user.roles);
      const username1 = user.username;
      const userEmail1 = user.userEmail;
      const roles = user.roles
      return resp.json({token, username1, userEmail1, roles});

    } catch(e){
      console.error(e);
      resp.status(400).json({message: 'Login error'})
    }
  }

  async getUsers(req, resp) {
    try {
      const users = await User.find()
    // resp.header('Access-Control-Allow-Origin', '*');
    // resp.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    // resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
      resp.json(users)
    } catch(e){
      console.error(e);
      resp.status(400).json({message: 'Users are not defined'})
    }
  }

   async getUserName(req, res, next) {
    const userId = req.user?.id;
  
    if (!userId) {
      return res.status(400).json({ message: `User ID must be provided` })
    }
  
    try {
      const user = await User.findById(userId);
       

        if(!user) {
          return res.status(400).json({message1:'User not found'})
        }
        const username = user.username;
        const userEmail = user.userEmail;
        const roles = user.roles
        res.json({username, userEmail, roles})
    } catch (e) {
      console.error(e);

    }
  }

  async checkPassword (req, res, next) {
    const userId = req.user?.id;
    const password = req.body?.password;
    if (!userId) {
      return res.status(400).json({ message: `User ID must be provided` })
    }
  try {
    const user = await User.findById(userId);
    const validPassword = await argon2.verify(user.password, password);
    if(!validPassword) {
      return res.status(400).json({ message: 'Password is incorrect'})
    }

    return res.json({message: 'Password is correct'})
  } catch (e) {
    console.error(e);
  }
  }

  async deleteUser(req, res) {
    try {
    const userId = req.user?.id;
    const password = req.body?.password;
    const user = await User.findById(userId);

    if (!userId) {
      res.status(400).json({message1: 'User ID must be provided'})
    }

    const validPassword = await argon2.verify(user.password, password);
    if(!validPassword) {
      return res.status(400).json({ message2: 'Password is incorrect'})
    }

    user.remove()
    return res.json({message: 'User was delete'});
    } catch (e) {
      console.error(e);
      res.status(400).json({message: 'Delete error'})
    }

    
  }

  //updateUser(name){
    async updateUserName(req, res) {
    const userId = req.user?.id;
    const name = req.body?.username;

    //const user = await User.findById(userId);

    if (!userId) {
      return res.status(400).json({ message: `User ID must be provided` })
    }

    const errors = validationResult(req);
    
      if (!errors.isEmpty()) {
        
        return res.status(400).json({errors}); 
      };

      try {
       const newUser = await User.findByIdAndUpdate({_id: userId}, {username: name}, {new: true});
       //await newUser.send();
       if(!newUser) {
        return res.status(400).json({message1:'User not found'})
      }
       const newUserName =  newUser.username;
       const newUserEmail = newUser.userEmail
       const roles = newUser.roles
       return res.json({message: 'User updated', newUser,newUserName,newUserEmail, roles})

      } catch (e) {
        console.error(e);
        
        return res.status(400).json({message3: 'Data can\'t update'})
      }
    }


    async updateUserEmail(req, res) {
      const userId = req.user?.id;
      const name = req.body?.userEmail;
  
      //const user = await User.findById(userId);
  
      if (!userId) {
        return res.status(400).json({ message: `User ID must be provided` })
      }
  
      const errors = validationResult(req);
      
        if (!errors.isEmpty()) {
          
          return res.status(400).json({errors}); 
        };
  
        try {
         const newUser = await User.findByIdAndUpdate({_id: userId}, {userEmail: name}, {new: true});
         //await newUser.send();
         if(!newUser) {
          return res.status(400).json({message1:'User not found'})
        }
        const newUserName =  newUser.username;
        const newUserEmail = newUser.userEmail
        const roles = newUser.roles
        return res.json({message: 'User updated', newUser,newUserName,newUserEmail, roles})
  
        } catch (e) {
          console.error(e);
          
          return res.status(400).json({message3: 'Data can\'t update'})
        }
      }
  //}

  async getPremium (req, res) {
    const userId = req.user?.id;
    const {key} = req.body;

    if (!userId) {
      return res.status(400).json({ message: `User ID must be provided` })
    }

    if (key !== 'PREMIUM') {
      return res.json({message: 'It is a wrong key'})
    }

    try{
      if (key ==='PREMIUM') {
        const user = await User.findOne({_id: userId});
        if (!user) {
          res.json({message: 'User not found'})
        }

        //res.json({ message: 'n', user})

        const newRole =user.roles.includes('PREMIUM')?user.roles: user.roles.push(key);

        //await user.save();

        const updateUser = await user.updateOne({roles: user.roles}, {roles: newRole}, {new: true});

        return res.json({message: 'Role updated', user, updateUser});
      }
    } catch (e) {
      console.error(e);
      res.json({message: 'Something went wrong'})
    }
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

  // async loginEmail(req, resp) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       console.log(req)
  //       return resp.status(400).json({errors}); 
  //     }
  //     const {userEmail, password} = req.body;
  //     const user = await User.findOne({userEmail});


  //     if(!user) {
  //       return resp.status(400).json({message: `User ${userEmail} not found`})
  //     }

  //     const validPassword = await argon2.verify(user.password, password);
  //     if(!validPassword) {
  //       return resp.status(400).json({ message: 'Password is incorrect'})
  //     }
  //     const token = generateAccesToken(user._id, user.roles);
  //     const username = user.username;
      
  //     return resp.json({token, username});

  //   } catch(e){
  //     console.error(e);
  //     resp.status(400).json({message: 'Login error'})
  //   }
  // }
}

module.exports = new Controller();