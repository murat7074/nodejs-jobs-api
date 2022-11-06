// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  // mongodb hata kodlarını client in anladığı dile çevirmeliyiz
  // customError
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'something went wrong try again later',
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  // validator err
  if (err.name === 'ValidationError') {
    // console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)  // email,password un message sine ulaşıcaz
      .join(',');
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    // mongodb hata kodları
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field please choose another value`;
    customError.statusCode = 400;
  }
// CastError
if(err.name === "CastError"){
  customError.msg = `No item found with id: ${err.value}`
   customError.statusCode = 404;
}
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }) // mongodb err içeriğini görmek için bunu kullan
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;

// Object.keys(err.keyValue) ==> [object object] olarak gelen değeri göstermiyor

// const { CustomAPIError } = require('../errors')
// const { StatusCodes } = require('http-status-codes')

// const errorHandlerMiddleware = (err, req, res, next) => {

//   if (err instanceof CustomAPIError) {
//     return res.status(err.statusCode).json({ msg: err.message })
//   }
//   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
// }

// module.exports = errorHandlerMiddleware
