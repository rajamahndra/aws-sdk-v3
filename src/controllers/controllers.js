const { uploadS3 } = require('../utils/uploadS3');
const { parseForm, postData } = require('../utils/helpers');
const { searchFace } = require('../utils/searchFace');
const fs = require('fs');

const uploadImage = async (req, res) => {
  const respon = {
    message: 'Invalid',
    data: {},
  };
  let status = 200;

  const { fields, files } = await parseForm(req);
  const [image] = files.image;
  const { bucket, folder } = fields;
  const original = await fs.promises.readFile(image.filepath);

  await uploadS3(original, bucket[0], folder[0])
    .then((data) => {
      respon.message = 'Success';
      respon.data = data;
    })
    .catch((error) => {
      status = 500;
      respon.message = 'An error occurred.';
      respon.error = error;
    });

  return res.status(status).send(respon);
};

const detectFace = async (req, res) => {
  const respon = {
    message: 'Invalid',
    data: {},
  };
  let status = 200;

  try {
    const { _, files } = await parseForm(req);
    const [image] = files.image;
    const original = await fs.promises.readFile(image.filepath);
    const result = await searchFace(original);
    console.log('result dari controller : ');
    console.log(result);

    if (!result) {
      respon.message = 'No Match Face Found';
      return res.status(status).send(respon);
    }
    let file = result.ExternalImageId;
    const [imageName, ext] = file.split('.');

    const user = await postData(url, { id_user: imageName });

    respon.message = 'Face Matches';
    respon.data = user.data;
  } catch (error) {
    console.log(error);
    respon.message = 'Failed To Search Face';
  }

  return res.status(status).send(respon);
};

module.exports = { uploadImage, detectFace };
