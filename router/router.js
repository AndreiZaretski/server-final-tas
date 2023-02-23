const Router =require('express');

const router = new Router();

const controller = require('../controller/controller');
const { check } = require('express-validator');

const authMiddlewaree = require('../middlewaree/authMidlewaree');
const rolehMiddlewaree = require('../middlewaree/roleMiddlewaree');
const verifyaccess = require('../middlewaree/verefyacces');

const mail = require('../controller/emailcontroller');

router.post('/registration', [check('username','Name can not be empty').notEmpty(), check('userEmail', 'It is not a valid email').isEmail(),
check('password', 'Password length must be between 4 and 10 characters').isLength({min:4, max:10})
] ,controller.reg);
router.post('/login', controller.login);

router.get('/users', controller.getUsers);

router.get('/username', authMiddlewaree, controller.getUserName);
router.delete('/delete',authMiddlewaree ,controller.deleteUser);
router.post('/checkpassword', authMiddlewaree, controller.checkPassword);
router.put('/updateusername', authMiddlewaree, [check('username','Name can not be empty').notEmpty()],  controller.updateUserName);
router.put('/updateuseremail',authMiddlewaree, [check('userEmail', 'It is not a valid email').isEmail()],  controller.updateUserEmail);

router.put('/updaterole', authMiddlewaree, controller.getPremium);
router.put('/updatepassword', [check('password', 'Password length must be between 4 and 10 characters').isLength({min:4, max:10})
], controller.updatePassword)

router.post('/sendkey', mail.sendKey);

router.put('/recoverpassword', [check('password', 'Password length must be between 4 and 10 characters').isLength({min:4, max:10})
], mail.checkKey);

router.post('/help', [check('userEmail', 'It is not a valid email').isEmail()], mail.sendTechHelp )

module.exports = router; 


