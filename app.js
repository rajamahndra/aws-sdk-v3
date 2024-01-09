const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const { uploadImage, detectFace } = require('./src/controllers/controllers.js');
const { uploadCollection } = require('./src/utils/helpers.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send(`HELLOW DUDE LETS GOO`);
});

app.post('/upload', uploadImage);
app.post('/detect', detectFace);
app.post('/up-collection', uploadCollection);

app.listen(PORT, () => {
  console.log(`Server running on || http://localhost:${PORT}.`);
});
