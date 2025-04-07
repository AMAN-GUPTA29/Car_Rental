
import { imageController } from "../controllers/util/image.upload.controller.js";
import {singleImageUpload} from "../middleware/s3FileUpload/index.js";
import {updateDataUser} from "../controllers/util/profile.update.controller.js";
import express from "express";

const router=express.Router();




router.post("/uploadimage",singleImageUpload,imageController);
router.patch("/profile/:id",updateDataUser);


export default router;