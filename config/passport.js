const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User.js");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  function(email, password, done) {
    console.log(email, password);
    // When a user tries to sign in this code runs
    User.findOne({
      email: email
    }).then(function(dbUser) {
      // If there's no user with the given email
      console.log(arguments)
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      dbUser.comparePassword(password).then(isMatch => {
        console.log(isMatch);
        if(!isMatch){
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        else {
          return done(null, dbUser)
        }
      });
    }).catch(err => console.log(err));
  }))

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
  cb(null, user);
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
