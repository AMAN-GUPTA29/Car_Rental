/**
 * @import S3Client from AWS SDK
 */
import { S3Client } from "@aws-sdk/client-s3";


/**
 * @type {S3Client}
 * @description Creates an S3 client instance for AWS S3 operations
 * @property {String} region - AWS region from environment variables
 * @property {Object} credentials - AWS credentials for authentication
 * @property {String} credentials.accessKeyId - AWS access key ID from environment variables
 * @property {String} credentials.secretAccessKey - AWS secret access key from environment variables
 */
const s3 = new S3Client({
  region: process.env.AWS_REGION, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  },
});

export default s3;
