import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

export const uploadToS3 = async (file) => {
  const key = `videos/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${params.Bucket}.s3.amazonaws.com/${key}`;
};