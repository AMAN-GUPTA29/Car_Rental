
/**
 * @import Multer upload configuration
 */
import {upload} from "./index.js"

/**
 * @description Middleware for handling single image upload to S3
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function singleImageUpload(req,res,next){
   /**
   * @description Use multer to handle file array with field name "images"
   */
  upload.array("images")(req, res, (err) => {
      /**
     * @description Handle file upload errors
     */
    if (err) {
      return res.status(400).json({
        message: "File upload failed",
        error: err.message,
      });
    } 
    
     /**
     * @description Process uploaded files and add their locations to request body
     */
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => file.location);
    }
     /**
     * @description Proceed to next middleware
     */
    next();
  });
}




export default singleImageUpload;

