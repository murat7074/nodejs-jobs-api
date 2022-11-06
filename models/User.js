const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true, //
  },
  password: {
    type: String,
    required: [true, 'please provide name'],
    minlength: 6,
    // maxlength: 12, // hash leyince maxlength ti artırmalısın
  },
});


// mongoose middleware
// function kullan , arrow function kullanma
UserSchema.pre("save",async function(){ // next() i de kullanmaya gerek kalmıyor
const salt = await bcrypt.genSalt(10)
this.password = await bcrypt.hash(this.password,salt)

})


// mongoose instance
// function kullan , arrow function kullanma
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {userId:this._id, name:this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}
// compare password
UserSchema.methods.comparePassword = async function(canditatePassword){
const isMatch = await bcrypt.compare(canditatePassword, this.password)
return isMatch
}

module.exports = mongoose.model('User', UserSchema);
