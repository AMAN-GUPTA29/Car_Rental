import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION, // Your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Store this in .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Store this in .env
  },
});

export default s3;
