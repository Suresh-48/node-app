import AWS from "aws-sdk";
import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";

// Config
import { awsRegion, awsAccessKeyId, awsSecretAccessKey, awsBucketName } from "../config.js";

/**
 * Update AWS config
 */
AWS.config.update({
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
});

const s3 = new AWS.S3();

/**
 * Get Public Image Url
 *
 * @param {*} filePath
 * @returns
 */
export function getPublicImagUrl(filePath) {
  return `https://${awsBucketName}.s3.ap-south-1.amazonaws.com/${filePath}`;
}

/**
 * Upload Base64 To File
 *
 * @param base64
 * @param newPath
 * @param callback
 */
export function uploadBase64File(base64, newPath, callback) {
  //const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const params = {
    Bucket: awsBucketName,
    Key: newPath,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/png",
    ACL: "public-read",
  };
  const extension = path.extname(newPath);
  const newFilePath = `${path.dirname(newPath)}/${path.basename(newPath, extension)}${extension}`;

  params.Key = newFilePath;

  s3.putObject(params, (err) => {
    if (err) {
      return callback(err);
    }
    return callback(null, newPath);
  });
}

////quizfile upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: awsBucketName,
    acl: "public-read",
    contentType: function (req, file, cb) {
      cb(null, file.mimetype);
    },
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, `${req.body.questionModel}/` + `${req.body.lessonName}/` + Date.now());
    },
  }),
});
export default upload.array("fileUpload", 10);
