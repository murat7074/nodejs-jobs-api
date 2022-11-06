const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  // user ile alakalı tüm job ları getirecek
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req; // nested distracting // user bilgilerini aldık

  const job = await Job.findOne({
    // mongodb de bulduk
    _id: jobId, // _id  jobId ile eşit olmalı
    createdBy: userId, // createdBy userId ile eşit olmalı
  });

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job }); // bilgileri client e sunduk
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId; // oluşturulan job user ile ilişkilendirilecek
  const job = await Job.create(req.body); // job oluşturuldu
  res.status(StatusCodes.CREATED).json({ job });
};


const updateJob = async (req, res) => {
  // console.log(req.user);  // { userId: '635d56ad4a57fe25f44c3aee', name: 'buğra' }
  const {
    body:{company,position},  //  company ve position u req.body den alıyoruz
    user: { userId },  // authentication.js middleware den alıyoruz
    params: { id: jobId },  // id i req.params dan alıyoruz
  } = req; // nested distracting
  
  if(company === "" || position === ""){  // company veya position dan birini güncellemeliyiz
    throw new BadRequestError("Company or Position fields cannot be empty")
  }

  const job = await Job.findOneAndUpdate({
      _id: jobId, // _id  jobId ile eşit olan
    createdBy: userId, // ve createdBy userId ile eşit olanı
  }, req.body,{new:true,runValidators:true}) // req.body ile update et

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({job})
};


const deleteJob = async (req, res) => {
    const {
    user: { userId },
    params: { id: jobId },
  } = req; // nested distracting // user bilgilerini aldık

  const job = await Job.findOneAndRemove({
    _id: jobId, 
    createdBy: userId,
  })
  
 if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).send()


};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
