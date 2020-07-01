import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import * as AWS from 'aws-sdk';
import { randomBytes } from 'crypto';

AWS.config.update({
  accessKeyId: process.env.KEY_ID,
  secretAccessKey: process.env.ACCESS_KEY,
  region: 'eu-west-1',
});

const s3 = new AWS.S3();

class Upload {
  uploadProfileImage = async (req: Request, res: Response) => {
    if (!req.files) return res.status(400).json({ status: 400, message: 'No image selected' });
    if (!req.files.profileImage)
      return res.status(400).json({ status: 400, message: `Please select an image to upload` });

    let profileImage = req.files.profileImage as UploadedFile;

    if (!profileImage.mimetype.includes('image/'))
      return res.status(400).json({ status: 400, message: `only images allowed for upload` });

    let resource = `${randomBytes(8).toString('hex')}.${profileImage.mimetype}`;

    const params = {
      Bucket: 'snowball-digital',
      ACL: 'public-read',
      Key: resource,
      Body: profileImage.data,
      ContentType: profileImage.mimetype,
    };

    const data = await s3.upload(params).promise();
    return res.status(200).json({ status: 200, url: data.Location });
  };
}

export default Upload