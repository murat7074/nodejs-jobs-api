/* user ın email ve password unu doğrulayıp token göndermiştik
şimdi o tokenin kontrolunü yapıcaz */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;  // client den geri gönderilen "Bearer + bir boşluk + token"
  
 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Bearer yanına bir boşluk bırak
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1]; // bir boşluk bırak, 2. değeri yani sadece token ı alıcaz (Bearer a gerek yok)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    

    // model içinde User.js de aşağıdaki gibi oluşturmuştuk
    /*   UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {userId:this._id, name:this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
} */
// attach the user the job routes

//  const user = User.findById(payload.userId).select("-password")  // buda diğer seçenek
//     req.user = user

    req.user = { userId: payload.userId, name: payload.name }; // controllers lardan bu şekilde alıcaz   { userId: '635d56ad4a57fe25f44c3aee', name: 'buğra' }
   
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = auth;
