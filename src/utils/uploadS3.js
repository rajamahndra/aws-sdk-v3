const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client } = require('@aws-sdk/client-s3');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = 'ap-southeast-3';

const uploadS3 = (file, Bucket, Prefix) => {
  return new Promise((resolve, reject) => {
    new Upload({
      client: new S3Client({
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        region,
      }),
      params: {
        ACL: 'public-read',
        Bucket,
        Key: `${Prefix}${Date.now().toString()}`,
        Body: file,
        ContentType: 'image/png',
      },
      // tags: [], // optional tags
      // queueSize: 4, // optional concurrency configuration
      // partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      // leavePartsOnError: false, // optional manually handle dropped parts
    })
      .done()
      .then((data) => {
        resolve(data.Location);
      })
      .catch((err) => {
        console.log(err.message);
        reject(err);
      });
  });
};

module.exports = { uploadS3 };
