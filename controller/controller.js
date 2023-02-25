const User = require('../model/user');
const Role = require('../model/role');
//const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { validationResult } = require('express-validator');

const generateAccesToken = require('./helpcontroler/getToken');



class Controller {
  async reg(req, resp) {
    try {
      const errors = validationResult(req);
      // resp.header('Access-Control-Allow-Origin', '*');
      // resp.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      // resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      if (!errors.isEmpty()) {
    
        return resp.status(400).json({errors}); 
      }
      let {username, userEmail, password} = req.body;
      const checkUser = await User.findOne({username});
      const checkEmail = await User.findOne({userEmail});

      if(checkUser) {
        return resp.status(400).json({message: 'The user with this name already exists'})
      }
      if(checkEmail) {
        return resp.status(400).json({messageAcc: 'The account with this email already exists'})
      }
      const passwordHash = await argon2.hash(password);
      const userRole = await Role.findOne({value: 'USER'});

      const user = new User({username, userEmail, password: passwordHash, roles: [userRole.value]});
      await user.save();
      const token = generateAccesToken(user._id, user.roles);
      const roles = user.roles;
      username = user.username;
      userEmail = user.userEmail;
      return resp.json({message: 'User is registered', username, userEmail, token, roles});
    } catch(e){
      console.error(e);
      return resp.status(400).json({message: 'Registration error'});
    }
  }

  async login(req, resp) {
    try {
      
      const username = req.body?.username;
      const userEmail = req.body?.userEmail;
      const password = req.body?.password;
      const user = await User.findOne({$or: [ { username },  {userEmail} ]});

      if(!user) {
  
        return resp.status(400).json({message: `User ${username || userEmail} not found`})
      }

      const validPassword = await argon2.verify(user.password, password);
      if(!validPassword) {
        return resp.status(400).json({ messageKey: 'Password is incorrect'})
      }
      const token = generateAccesToken(user._id, user.roles);
      const username1 = user.username;
      const userEmail1 = user.userEmail;
      const roles = user.roles
      return resp.json({token, username1, userEmail1, roles});

    } catch(e){
      console.error(e);
      return resp.status(400).json({message: 'Login error'})
    }
  }

  async getUsers(req, resp) {
    try {
      const users = await User.find();
    
      return resp.json(users);
    } catch(e){
      console.error(e);
      return resp.status(400).json({message: 'Users are not defined'})
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
          return res.status(400).json({message1:'User not found'});
        }
        const username = user.username;
        const userEmail = user.userEmail;
        const roles = user.roles
        return res.json({username, userEmail, roles})
    } catch (e) {
      console.error(e);
      return res.status(400).json({message1:'User not found'});
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
    if(!user) {
      return res.status(400).json({message:'User not found'})
    }
    const validPassword = await argon2.verify(user.password, password);
    if(!validPassword) {
      return res.status(400).json({ messageNo: 'Password is incorrect'})
    }
     const userEmail = user.userEmail
    return res.json({messageOK: 'Password is correct', userEmail})
  } catch (e) {
    console.error(e);
    return res.json({message1: 'Something went wrong'})
  }
  }

  async deleteUser(req, res) {
    try {
    const userId = req.user?.id;
    const password = req.body?.password;
    const user = await User.findById(userId);

    if (!userId) {
      return res.status(400).json({message: 'User ID must be provided'})
    }

    if (!user) {
      return res.status(400).json({message: 'User not found'})
    }

    const validPassword = await argon2.verify(user.password, password);
    if(!validPassword) {
      return res.status(400).json({ messageNo: 'Password is incorrect'})
    }

    user.remove()
    return res.json({messageOK: 'User was delete'});
    } catch (e) {
      console.error(e);
      return res.status(400).json({message: 'Delete error'})
    }

    
  }

  //updateUser(name){
    async updateUserName(req, res) {
    const userId = req.user?.id;
    const name = req.body?.username;

    if (!userId) {
      return res.status(400).json({ message: `User ID must be provided` })
    }

    const errors = validationResult(req);
    
      if (!errors.isEmpty()) {
        
        return res.status(400).json({errors}); 
      };

      try {
       const newUser = await User.findByIdAndUpdate({_id: userId}, {username: name}, {new: true});
       
       if(!newUser) {
        return res.status(400).json({message:'User not found'})
      }
       const newUserName =  newUser.username;
       const newUserEmail = newUser.userEmail
       const roles = newUser.roles
       return res.json({messageOK: 'User updated',  newUserName, newUserEmail, roles})

      } catch (e) {
        console.error(e);
        
        return res.status(400).json({messageNo: 'Data can\'t update'})
      }
    }


    async updateUserEmail(req, res) {
      const userId = req.user?.id;
      const name = req.body?.userEmail;
   
      if (!userId) {
        return res.status(400).json({ message: `User ID must be provided` })
      }
  
      const errors = validationResult(req);
      
        if (!errors.isEmpty()) {
          
          return res.status(400).json({errors}); 
        };
  
        try {
         const newUser = await User.findByIdAndUpdate({_id: userId}, {userEmail: name}, {new: true});
         
         if(!newUser) {
          return res.status(400).json({message:'User not found'})
        }
        const newUserName =  newUser.username;
        const newUserEmail = newUser.userEmail
        const roles = newUser.roles
        return res.json({messageOK: 'User updated', newUserName,newUserEmail, roles})
  
        } catch (e) {
          console.error(e);
          
          return res.status(400).json({messageNo: 'Data can\'t update'})
        }
      }
  //}

  async getPremium (req, res) {
    const userId = req.user?.id;
    const {key} = req.body;

    if (!userId) {
      return res.status(400).json({ message: `User ID must be provided` })
    }

    if (key !== 'RSSchool') {
      return res.json({messageNo: 'It is a wrong key'})
    }

    try{
      if (key ==='RSSchool') {
        const user = await User.findOne({_id: userId});
        if (!user) {
         return res.json({message: 'User not found'})
        }

        const newRole =user.roles.includes('PREMIUM')?user.roles: user.roles.push('PREMIUM');

        const updateUser = await user.updateOne({roles: user.roles}, {roles: newRole}, {new: true});

        return res.json({messageOK: 'Premium access is available', user, updateUser});
      }
    } catch (e) {
      console.error(e);
      return res.json({message: 'Something went wrong'})
    }
  }

  async updatePassword(req, res) {
try {
  const {userEmail, password} = req.body;
  const user = await User.findOne({userEmail});

  const errors = validationResult(req);
      
      if (!errors.isEmpty()) {

        return res.status(400).json({errors}); 
      }

  if(!user) {
      return res.status(400).json({message: `User ${userEmail} not found`})
  }

  const passwordHash = await argon2.hash(password);

  user.password = passwordHash;
  await user.save();

  return res.json({messageOK: 'Password was updated'});

} catch (e) {
  console.error(e);
  return res.json({message: 'Something went wrong'})
}
   
  }

}

module.exports = new Controller();