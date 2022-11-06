
require('dotenv').config();
require('express-async-errors');

// extra security packages  //
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")
// extra security packages //


const express = require('express');
const app = express();
 
app.set("trust proxy", 1)

  app.use(rateLimiter({
    windowMs:15 * 60 * 1000,// 15 minutes
    max: 100, // limit each api to 100 request per windowMs
  }))

 app.use(express.json());  // bunu routers ların üstüne koy

 app.use(helmet())
 app.use(cors())
 app.use(xss())


// extra packages
//connectDB
const connectDB=require('./db/connect')
const authenticateUser = require('./middleware/authentication');
 
//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
 
app.get('/',(req,res)=>{
  res.send("jobs api")
})


//routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRouter)  // jobsRouter route authenticateUser ile korunmuş olucak
 
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
 

 
// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});
 
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
 
const port = process.env.PORT || 3000;
 
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
 
start();
 