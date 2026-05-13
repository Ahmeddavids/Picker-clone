const User = require('../models/userModel')
const passport = require('passport')
const jwt = require('jsonwebtoken')


const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
},
  async function (request, accessToken, refreshToken, profile, done) {
    // console.log(" i am profile :", profile);

    const checkUser = await User.findOne({ email: profile._json.email })
    let token
    if (checkUser) {
      token = await jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET, { expiresIn: '1day' });
    } else {
      const createUser = await User.create({
        name: profile._json.name,
        email: profile._json.email,
        isVerified: profile._json.email_verified,
        role: 'user'
      })
      token = await jwt.sign({ id: createUser._id }, process.env.JWT_SECRET, { expiresIn: '1day' });
    }
    return done(null, token)

  },
  passport.serializeUser((token, done) => {
    return done(null, token)
  }),
  passport.deserializeUser((token, done) => {
    return done(null, token)
  })

));


