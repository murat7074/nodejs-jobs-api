
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'please provide company name'],
    maxlength: 50,
  },
 position: {
    type: String,
    required: [true, 'please provide position '],
    maxlength: 100,
  },
   status: {
    type: String,
    enum: ["interview","decline","pending"],
    default:"pending"
  
  },
  createdBy:{
   type:mongoose.Types.ObjectId,
   ref:"User",
    required: [true, 'please provide user'],
  }
},{timestamps:true});   //  "timestamps"   "createdAt": ve "updatedAt":  i otomatikmen oluşturuyor

module.exports = mongoose.model("Job",UserSchema)
