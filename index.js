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

// 1. O endpoint deve retornar um array com todas as pessoas palestrantes cadastradas
app.get('/talker', (_request, response) => {
  try {
    const people = fs.readFileSync(TALKER, 'utf-8');
    return response.status(200).json(JSON.parse(people));
  } catch (error) {
    return error;
  }
});

// 2. O endpoint deve retornar uma pessoa palestrante com base no id da rota.
app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const people = fs.readFileSync(TALKER, 'utf-8');
  const person = people.find((p) => Number(p.id) === Number(id));
  if (!person) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return res.status(200).json(person);
});
