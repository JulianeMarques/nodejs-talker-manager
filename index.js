const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const TALKER = 'talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', (_request, response) => {
  try {
    const people = fs.readFileSync(TALKER, 'utf-8');
    return response.status(200).json(JSON.parse(people));
  } catch (error) {
    return error;
  }
});
