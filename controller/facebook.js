const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

// passport.use(new FacebookStrategy(
//   {
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3000/auth/facebook/callback",
//     profileFields: ['id', 'displayName', 'emails']
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(profile); // debug

//     const user = {
//       facebookId: profile.id,
//       name: profile.displayName,
//       email: profile.emails?.[0]?.value
//     };

//     return done(null, user);
//   }
// ));