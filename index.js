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
  const person = JSON.parse(people).find((p) => Number(p.id) === Number(id));
  if (!person) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return res.status(200).json(person);
});

// 3. O endpoint deve ser capaz de retornar um token aleatório de 16 caracteres que deverá ser utilizado nas demais requisições.
app.post('./login', (req, res) => {

  return res.status(200).json({ token });
});

// token: https://www.codegrepper.com/code-examples/javascript/create+16+char+token+jsv
// var crypto = require("crypto");
// var id = crypto.randomBytes(8).toString('hex');

const crypto = require("crypto");
const createToken = () => {
  return crypto.randomBytes(8).toString('hex');
};

const validEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || email === '') {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  };
};

const validPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return 'O campo "password" é obrigatório';
  }
  if (password.length < 6) {
    return 'O "password" deve ter pelo menos 6 caracteres';
    return undefined;
  }
};

