const Router =require('express');

const router = new Router();

const controller = require('./controller');
const { check } = require('express-validator');

const authMiddlewaree = require('./middlewaree/authMidlewaree');
const rolehMiddlewaree = require('./middlewaree/roleMiddlewaree');
const verifyaccess = require('./middlewaree/verefyacces');
const verefyacces = require('./middlewaree/verefyacces');

router.post('/registration', [check('username','Name is not be empty').notEmpty(),
check('password', 'Password may be more than 4 symboles and less than 10').isLength({min:4, max:10})
] ,controller.reg);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);
//rolehMiddlewaree(['USER', 'ADMIN']), 
router.get('/logout',verefyacces,  controller.logOutUser);

module.exports = router; 


