// Load required packages ---------------------------------------------
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


// SHARED VALIDATION FUNCTIONS
var passwordLong = (string) => {
  return string && string.length >= 5;
};

// var validateLength = [isNotTooShort, 'Too short' ];
var validateLength = [{validator: passwordLong, msg: 'Password should contain atleast 8 characters'} ];

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Define our user schema
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: [true, 'Username is already taken'] },
  password: { type: String, required: true, validate: validateLength },
  role: String,
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: Date
});

//When updating user get the current date
UserSchema.pre('save', function(next){
  now = new Date();
  this.dateUpdated = now;
  next();
});

// Execute before each user.save() call ------------------------------
  UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed ------------------------
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it --------------------------
  //bcrypt generate salt 5 rounds ------------------------------------
  bcrypt.genSalt(6, (err, salt) => {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Export the Mongoose model -----------------------------------------
var userSch = module.exports = mongoose.model('User', UserSchema);