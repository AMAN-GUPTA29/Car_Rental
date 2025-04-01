/**

@import Express framework

@import Authentication controllers
*/
import express from "express";
import signupController from "../controllers/auth/signup.controller.js"
import { loginController } from "../controllers/auth/login.controller.js";

/**
 * @type {express.Router}
 * @description Create an Express router instance for authentication routes
 */
const router=express.Router();

/**
 * @description Route to handle user registration
 */
router.post("/signup",signupController);


/**
 * @description Route to handle user login
 */

router.post("/login",loginController)

export default router;
