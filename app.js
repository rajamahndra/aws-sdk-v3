const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const { uploadImage } = require('./src/controllers/controllers.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send(`HELLOW DUDE LETS GOO`);
});

app.post('/upload', uploadImage);

app.listen(PORT, () => {
  console.log(`Server running on || http://localhost:${PORT}.`);
});
