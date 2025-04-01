/**
 * @import File upload middleware for S3
 */
import {upload} from "./s3FileUploads.middleware.js"
import singleImageUpload from "./s3SingleImageUpload.middleware.js"
/**
 * @description Export file upload middleware functions
 * @exports upload - Middleware for handling multiple file uploads to S3
 * @exports singleImageUpload - Middleware for handling single image upload to S3
 */
export {upload,singleImageUpload}