const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError,UnauthenticatedError } = require('../errors');


const register = async (req, res) => {
  /*  models User.js içinde mongoose middleware yazdık 
  ve burada bir sürü kod yazmaya gerek kalmadı */

  // hashed password and name,email  mongodb ye yükle
  const user = await User.create({ ...req.body });
  // create token
const token = user.createJWT()
  
  // models User.js içinde mongoose instance yazdık 
 res.status(StatusCodes.CREATED).json({user:{name:user.name}, token });
  


// res.status(StatusCodes.CREATED).json({user:{name:user.name}, token }); 
// yukarıdaki kodun görünüşü  {
//     "user": {
//         "name": "turat3"
//     },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzU5N2MyZDUyYjJiYjQ4ODQxYmVlMjIiLCJuYW1lIjoidHVyYXQzIiwiaWF0IjoxNjY2ODA4ODc3LCJleHAiOjE2Njk0MDA4Nzd9.D3qkjOxFwewzOqlSHi9D3q7XUWdIWcI6kJaWYh_hTaU"
// }
};

const login = async (req, res) => {
 const {email,password} = req.body

  if(!email || !password){
    throw new BadRequestError("please provide email and password")
  }
  const user = await User.findOne({email})  // email kontrol ediliyor

if(!user){
  throw new UnauthenticatedError("Invalid Credentials")
}
// compare password
const isPasswordCorrect = await user.comparePassword(password)
if(!isPasswordCorrect){
  throw new UnauthenticatedError("Invalid Credentials")
}
// email ve password doğruysa yeni token gönderilicek
const token = user.createJWT()
res.status(StatusCodes.OK).json({user:{name:user.name},token})


};

module.exports = {
  register,
  login,
};
