const Router =require('express');

const router = new Router();

const controller = require('./controller');
const { check } = require('express-validator');

const authMiddlewaree = require('./middlewaree/authMidlewaree');
const rolehMiddlewaree = require('./middlewaree/roleMiddlewaree');
const verifyaccess = require('./middlewaree/verefyacces');
const verefyacces = require('./middlewaree/verefyacces');

router.post('/registration', [check('username','Name is not be empty').notEmpty(), check('userEmail', 'It is not valid email').isEmail(),
check('password', 'Password may be more than 4 symboles and less than 10').isLength({min:4, max:10})
] ,controller.reg);
router.post('/login', controller.login);
// router.post('/loginEmail', check('userEmail', 'It is not valid email').isEmail(), controller.loginEmail);
router.get('/users', controller.getUsers);

router.get('/username', authMiddlewaree, controller.getUserName);
router.delete('/delete',authMiddlewaree ,controller.deleteUser);
router.post('/checkpassword', authMiddlewaree, controller.checkPassword);
router.put('/updateusername', authMiddlewaree, [check('username','Name is not be empty').notEmpty()],  controller.updateUserName);
router.put('/updateuseremail',authMiddlewaree, [check('userEmail', 'It is not valid email').isEmail()],  controller.updateUserEmail);

router.put('/updaterole', authMiddlewaree, controller.getPremium);
router.put('/updatepassword', [check('password', 'Password may be more than 4 symboles and less than 10').isLength({min:4, max:10})
], controller.updatePassword)
//rolehMiddlewaree(['USER', 'ADMIN']), 
//router.get('/logout',verefyacces,  controller.logOutUser);
//[check('username','Name is not be empty').notEmpty()],
//, check('userEmail', 'It is not valid email').isEmail()


module.exports = router; 


