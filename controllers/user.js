import User from "../models/User.js";
import AWS from "aws-sdk";

export const image = async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });
  const s3 = new AWS.S3();
  const fileContent = Buffer.from(req.files.data.data, "binary");
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.files.data.name,
    Body: fileContent,
  };
  const userId = req.params.id;
  s3.upload(params, (err, data) => {
    if (err) {
      throw err;
    }
    const newData = User.update(
        {
          ktp: data.Location,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      res.status(200).send({
        success: true,
        message: "File successfully uploaded",
        data: data,
      });
  })
  
};
