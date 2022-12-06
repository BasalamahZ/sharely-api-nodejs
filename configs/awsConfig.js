import AWS from "aws-sdk";
import path from "path";

export const AWSConfig = async files => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });
  const s3 = new AWS.S3();
  const fileContent = Buffer.from(files.data.data, "binary");
  const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: files.data.name,
      Body: fileContent,
      ContentType: "image/jpeg",
    };
  

  return await s3.upload(params).promise();
  // const params = {
  //   Bucket: process.env.AWS_BUCKET_NAME,
  //   Key: file.name,
  //   Body: fileContent,
  //   ContentType: "image/jpeg",
  // };
  // s3.upload(params).promise()
};
