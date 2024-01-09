const formidable = require('formidable');
const AWS = require('aws-sdk');
const axios = require('axios');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_REKOGNITION,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_REKOGNITION,
  region: process.env.AWS_REGION_REKOGNITION,
});
const { AWS_BUCKET_NAME, AWS_BUCKET_FOLDER_NAME, AWS_COLLECTION_ID } = process.env;
var rekognition = new AWS.Rekognition();
var s3 = new AWS.S3();

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
}

const postData = async (url, body, options) => {
  try {
    let response = await axios.post(url, body, options);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const uploadCollection = async (req, res) => {
  // Fungsi untuk mengupload gambar ke AWS Rekognition
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Prefix: AWS_BUCKET_FOLDER_NAME,
  };

  // Panggil metode listObjectsV2 pada objek S3
  const objects = await s3.listObjectsV2(params).promise();
  const arrReturn = [];

  console.log('objects : '); // Use the object key as the external image ID
  console.log(objects);
  // Index faces in each object and add them to the specified collection
  for (const object of objects.Contents) {
    const externalImageId = object.Key.split('/').pop();
    const image = {
      S3Object: {
        Bucket: AWS_BUCKET_NAME,
        Name: object.Key,
      },
    };
    try {
      const result = await rekognition
        .indexFaces({
          CollectionId: AWS_COLLECTION_ID,
          Image: image,
          ExternalImageId: externalImageId,
        })
        .promise();
      console.log(`Indexed ${result.FaceRecords.length} faces in ${object.Key}`);
      arrReturn.push(`faces in ${object.Key}`);
    } catch (err) {
      console.error(`Error indexing faces in ${object.Key}: ${err}`);
    }
  }

  return res.status(200).send({ data: arrReturn });
};
module.exports = { parseForm, postData, uploadCollection };
