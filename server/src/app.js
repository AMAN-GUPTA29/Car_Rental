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
import cors from 'cors';
import morgan from 'morgan';
import passport from "passport";
import { jwtStrategy } from "./config/passport.config.js";
import * as fs from 'fs'; 
const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });


/**
 * 
 */
import authRoute from './routes/auth.route.js';



import ownerRoutes from './routes/ownerroutes/ownerListing.route.js'


import consumerRoutes from './routes/consumerroutes/consumerroutes.js'


import adminRoutes from './routes/adminroutes/adminroutes.js'


import imageRoute from './routes/utils.route.js'


 /**
  * App Variables
  * @const app
  */
const app = express();  


app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500","http://localhost:3000","http://127.0.0.1:5500","http://127.0.0.1:5501"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
  );
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());   
jwtStrategy(passport);
app.use(passport.initialize());


app.use('/api/v1/auth', authRoute);

app.use('/api/v1/owner',ownerRoutes);

app.use('/api/v1/consumer',consumerRoutes)

app.use('/api/v1/admin',adminRoutes);

app.use('/api/v1/util',imageRoute)




export default app;  