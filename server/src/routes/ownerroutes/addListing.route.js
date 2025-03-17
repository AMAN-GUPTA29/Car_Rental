import express from "express";
import {authenticateJwt} from "../../middleware/authenticate/index.js"
import {singleImageUpload} from "../../middleware/s3FileUpload/index.js"
import {listingController} from "../../controllers/owner/owner.listing.js"
const router=express.Router();

router.post("/createlisting",authenticateJwt,singleImageUpload,listingController);


export default router;
