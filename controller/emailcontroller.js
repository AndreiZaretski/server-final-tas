const User = require('../model/user');
const argon2 = require('argon2');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const randomKey = require('./helpcontroler/getrandomkey')

const generateAccesToken = require('./helpcontroler/getToken');

const keyArray = require('./helpcontroler/keyarray');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'helpavaeditor@gmail.com',
    pass: 'metprvcoszmcdtqt'
  }
});

class Mail {
   async sendKey(req, res) {
    const userEmail  = req.body.userEmail

    const checkEmail = await User.findOne({userEmail});

    if(!checkEmail) {
        return res.status(400).json({messageNo: `Email ${ userEmail} not found`})
    }

    try {
      const key = randomKey();
      const mailOptions = {
        from: 'helpavaeditor@gmail.com',
        to: userEmail,
        subject: 'key',
        text: key
      };

      const result = await transporter.sendMail(mailOptions); 
      if(!result) {
        return res.json({message: 'Email not sent'})
      }
      return res.json({messageOK: 'An email with a recovery key was sent to the mail.'})
      
    } catch(e) 
    {
      console.error(e);
      res.status(400).json({message: 'Email not sent'})
    }
   }

   async checkKey(req, res) {
   try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(400).json({errors}); 
      }

    let {key, userEmail, password} = req.body;

    
    if(!keyArray.includes(key)) {
      return res.json({messageNo: 'It\'s a wrong key'})
    }

    const user =  await User.findOne({userEmail});
    if(!user) {
      return res.status(400).json({message: `Email ${userEmail} not found`})
    }

    const passwordHash = await argon2.hash(password);
    const token = generateAccesToken(user._id, user.roles);
    const roles = user.roles;
    const username = user.username;
    userEmail = user.userEmail;

    user.password = passwordHash;
    await user.save();

    
    return res.json({messageOK: 'Password has been recovered', username, userEmail, token, roles});
  } catch(e) {
    console.error(e);
    res.json({message:"Something went wrong"});
  }
  }

  async sendTechHelp(req, res){
   const { userEmail, text} = req.body;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
         return res.status(400).json({errors}); 
   }
   try {
    const mailOptions = {
      from: 'helpavaeditor@gmail.com',
      to: userEmail,
      subject: 'Technical support',
      text: "Your message is accepted, we will answer you within 50 years. This email was generated automatically and you do not need to reply to it. If it wasn\'t you, please ignore this email.",
      html: 'Your message is accepted, we will answer you within 50 years. <br>  <br><i> This email was generated automatically and you do not need to reply to it. </i><br>  <br> If it wasn\'t you, please ignore this email.'

    };

    const mailOptionsMessage = {
      from: 'helpavaeditor@gmail.com',
      to: 'helpavaeditor@gmail.com',
      subject: `Message from ${userEmail}`,
      text: `${text} <br> ${userEmail}`,
      html: `<b>Message:</b><br>${text} <br>  <br> This letter is from ${userEmail}`
    };

    const result = await transporter.sendMail(mailOptions); 
    const resultMessage = await transporter.sendMail(mailOptionsMessage); 
    if(!result && resultMessage) {
      res.json({message: 'Email not sent, check the correctness of the entered mail'})
    }
    return res.json({messageOK: 'Your message is accepted.'})
    
  } catch(e) 
  {
    console.error(e);
    res.status(400).json({message: 'Email not sent, check the correctness of the entered mail'})
  }
  }  
}
module.exports = new Mail();