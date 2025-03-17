/**
 * This is the entry point of the server
 * It creates an express application object and listens on a port
 * The server is started by running the command `npm Start`
 * The server listens on port 8080 by default
 */
import dotenv from 'dotenv';
import connection from './config/db.config.js';
import app from './app.js';

dotenv.config();
connection();

const port=process.env.PORT || 8080; // This is the port your server will run on
app.listen(port,()=>console.log(`Listning on port ${port}....`)); // This is the server object that listens to client requests