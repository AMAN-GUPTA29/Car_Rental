import express from "express";
import signupController from "../controllers/auth/signup.controller.js"
import { loginController } from "../controllers/auth/login.controller.js";
import {authenticateJwt} from "../middleware/authenticate/index.js"
const router=express.Router();

router.post("/signup",signupController);
router.post("/login",loginController)

export default router;
