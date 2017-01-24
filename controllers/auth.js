// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use(new BasicStrategy(
  (username, password, callback) => {
    //Find user
    User.findOne({ username: username }, 
      (error, user) => {
        if (error) { return callback(error); }

        // No user found with that username
        if (!user) { return callback(null, false, { message: 'Incorrect username' }); }

        // Make sure the password is correct
        user.verifyPassword(password, (error, isMatch) => {
          if (error) { return callback(error); }

          // Password did not match
          if (!isMatch) { return callback(null, false, { message: 'Incorrect password' }); }

          // Success
          return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate(['basic'], { session : false });