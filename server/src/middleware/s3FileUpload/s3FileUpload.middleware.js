import multer from "multer";
import multerS3 from "multer-s3";
import {s3} from "../../utils/index.js"; // Import your S3 client

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_NAME, // Your S3 bucket name
    acl: "public-read", // Access control list (e.g., public-read)
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set content type
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      cb(null, fileName); // File name on S3
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
});

export { upload };
