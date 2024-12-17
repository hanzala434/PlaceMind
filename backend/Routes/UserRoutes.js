const express=require('express')
const {registerUser,loginUser }=require('../controller/userController')
const router=express.Router()

router.post('/register',registerUser);
router.post('/login',loginUser);
// router.post('/google-login', googleLogin);


module.exports=router;