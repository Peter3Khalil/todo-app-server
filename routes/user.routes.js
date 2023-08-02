const router = require('express').Router();
const {validateRegister,validateUserUpdate, validateLogin} = require('../middlewares/validate.js');
const {register, login,getUser, deleteAccount, updateUser, verifyEmail, resendVerificationEmail, logout} = require('../controllers/user.controller.js');
const {authenticateUser} = require('../middlewares/auth.js');
router.post('/register',validateRegister,register);
router.post('/login',validateLogin,login);
router.get('/',authenticateUser,getUser);
router.delete('/',authenticateUser,deleteAccount);
router.put('/',authenticateUser,validateUserUpdate,updateUser);
router.get('/verify/:verificationToken',verifyEmail);
router.get('/resend-verification-email',authenticateUser,resendVerificationEmail);
router.get('/logout',authenticateUser,logout);
module.exports = router;