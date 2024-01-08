const { uploadS3 } = require('./uploadS3');
const { parseForm } = require('./helpers');
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

module.exports = { uploadImage };
