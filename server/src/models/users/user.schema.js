import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  
    aadhar:{
        type:Number,
        required:true,
    },
    authorise:{
        type:Boolean,
        required:true,
    },
    blocked:{
        type:Boolean,
        default:false,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    userName:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    signupDate:{
        type:Date,
        default:Date.now,
    },
});



schema.methods.generateAuthToken = function (user) {
    const payload={
    _id: this._id, 
    email:user.email,
    phone:user.phone,
    userName:user.userName,
    role:user.role,
    aadhar:user.aadhar
    }

  
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );
    return token;
  };
  

  const User = mongoose.model("User", schema);
  export default User;
