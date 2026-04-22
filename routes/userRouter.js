const { register, verifyEmail, resendOTP, login } = require('../controller/userController');
const passport = require('passport')
const router = require('express').Router();

router.post('/register', register);

router.post('/verify', verifyEmail);

router.post('/resend-otp', resendOTP);

router.post('/login', login);

router.get('/collect', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/googleLogin', passport.authenticate('google', {
    successRedirect: '/api/user/loginsuccess', 
    failureRedirect: '/api/user/loginfailed'}))

router.get('/loginsuccess', (req, res) => {
        res.json({message: 'Login successful', 
            data: req.user})
    })

router.get('/loginfailed', (req, res) => {
        res.json({message: 'Login failed'})
    })  
    

router.get('/githubLogin', passport.authenticate('github2'));

router.get('/githubLogin/callback',passport.authenticate('github2', {failureRedirect: '/login',session: false}),
  (req, res)  => {
    res.json({message:"GitHub login successful", data:req.user});
  }
);

// router.get('/auth/facebook',
//   passport.authenticate('facebook'));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//    });

module.exports = router