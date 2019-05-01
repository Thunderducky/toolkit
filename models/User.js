const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")

const { Schema } = mongoose;
// taken from https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
const emailRe = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const validateEmail = email => {
  return emailRe.test(email);
}
const UserSchema = new Schema({
  email: {
    type: String,
    required: 'Email address is required',
    lowercae: true,
    unique: true,
    // probably only need one of these, need to test that
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [emailRe, 'Please fill a valid email address']
  },
  password: { type: String, required: true },
});

// Whenever we want to save the user
// we will check if the password has been updated
// if it has, we will encrypt it before saving it
UserSchema.pre('save', function(next){
  if(this.isModified('password') || this.isNew){
    // GEN SOME SALT UP
    bcrypt.genSalt(10, (saltErr, salt) => {
      if(saltErr){
        return next(saltErr);
      }
      bcrypt.hash(this.password, salt, null, (hashError, hash) => {
        if(hashError){
          return next(hashError);
        }
        this.password = hash;
        return next();
      });
    })
  } else {
    return next();
  }
});

// treat this like a promise
UserSchema.methods.comparePassword = function(pass){
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, this.password, (err, isMatch) => {
      if(err) { reject(err)}
      resolve(isMatch);
    });
  })
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
