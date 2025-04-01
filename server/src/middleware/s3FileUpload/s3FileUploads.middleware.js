/**
 * @import Multer for file upload handling
 * @import Multer S3 integration
 * @import AWS S3 client
 */
import multer from "multer";
import multerS3 from "multer-s3";
import {s3} from "../../utils/index.js"; 

/**
 * @type {multer.Multer}
 * @description Configure multer with S3 storage for file uploads
 */
const upload = multer({
   /**
   * @description Configure S3 storage options
   */
  storage: multerS3({
    s3,
    bucket: process.env.S3_NAME, 
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    /**
     * @description Generate unique filename for uploaded file
     */
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      cb(null, fileName); 
    },
  }),
  /**
   * @description Set file size limits (5MB)
   */
  limits: {
    fileSize: 1024 * 1024 * 5, 
  },
});

export { upload };
