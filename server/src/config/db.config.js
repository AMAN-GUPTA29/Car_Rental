
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const connection=()=>{
    const connectionParams={};
    try{
        mongoose.connect(process.env.MONGO_URI,connectionParams);
        console.log("connnected to database");
    }catch(error){
        console.log(error);
        console.log("could not connect to database");
    }
}

export default connection;