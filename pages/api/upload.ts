import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
export default async function handler(req, res) {
  const { files, fields } = await new Promise((resolve, reject) => {
    new multiparty.Form().parse(req, async (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  const client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  let links = [];
  for (const file of files.file) {
    const extensionFile = file.originalFilename.split(".").pop();
    const newFileName = `${Date.now()}.${extensionFile}`;
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: newFileName,
        Body: fs.readFileSync(file.path),
        ContentType: file.headers["content-type"],
        ACL: "public-read",
      })
    );
    const link = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${newFileName}`;
    links.push(link);
  }
  res.json({ links });
}
export const config = {
  api: {
    bodyParser: false,
  },
};
