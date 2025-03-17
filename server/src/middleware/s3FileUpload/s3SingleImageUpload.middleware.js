import {upload} from "./index.js"


function singleImageUpload(req,res,next){
     // Use multer's .array() to handle multiple files dynamically
  upload.array("images")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: "File upload failed",
        error: err.message,
      });
    }

    
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => file.location); // Replace `images` field with array of S3 URLs
    }

    next(); // Proceed to controller
  });
}




export default singleImageUpload;

