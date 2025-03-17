/**
 * Required External Modules
 * These are the modules that are required for the server to run
 * express is a web application framework for Node.js
 * @imports express
 * @imports body-parser
 * @imports dotenv
 * @imports connection
 * @imports cors
 */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from "passport";
import { jwtStrategy } from "./config/passport.config.js";






/**
 * 
 */
import authRoute from './routes/auth.route.js';



import createListing from './routes/ownerroutes/addListing.route.js'


 /**
  * App Variables
  * @const app
  */
const app = express();  


app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.json());   // This is a middleware that parses incoming requests with JSON payloads
app.use(bodyParser.urlencoded({extended:false}))  // This is a middleware that parses incoming requests with urlencoded payloads
jwtStrategy(passport);
app.use(passport.initialize());


app.use('/api/v1/auth', authRoute);

app.use('/api/v1/owner',createListing);



export default app;  // This exports the app object to be used in other files