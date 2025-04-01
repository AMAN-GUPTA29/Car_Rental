/**
 * Database Configuration Module
 * This module handles the MongoDB database connection using Mongoose.
 * It exports a connection function that establishes the database connection
 * using environment variables for configuration.
 * 
 * @module db.config
 */

/**
 * Import required dependencies
 * mongoose - ODM library for MongoDB
 * dotenv - For loading environment variables
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Initialize dotenv configuration
dotenv.config();

/**
 * Establishes connection to MongoDB database
 * Uses MONGO_URI from environment variables
 * 
 * @function connection
 * @returns {void}
 * @throws {Error} When database connection fails
 */
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