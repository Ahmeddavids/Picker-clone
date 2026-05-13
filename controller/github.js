const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// passport.use('github2', new GitHubStrategy({
//   clientID: process.env.GITHUB_CLIENT_ID,
//   clientSecret: process.env.GITHUB_CLIENT_SECRET,
//   callbackURL: process.env.GITURL
// },
// async function(request, accessToken, refreshToken, profile, done) {
//   console.log(profile);

// const checkUser = await User.findOne({ name: profile.username })
//     let token 
//     if(checkUser) {
//         token = await jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET, { expiresIn: '1day'});
//      }else{ 
//         const createUser = await User.create({
//             name: profile.username,
//             role: 'user'
//         })
//         token = await jwt.sign({ id: createUser._id }, process.env.JWT_SECRET, { expiresIn: '1day'});
//     }

//   return done(null, token);
// },
// passport.serializeUser((token, done) => {
//     return done(null, token)
//   }),
//   passport.deserializeUser((token, done) => {
//     return done(null, token)
//   })
// ));