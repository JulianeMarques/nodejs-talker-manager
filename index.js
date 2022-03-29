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

// token: https://www.codegrepper.com/code-examples/javascript/create+16+char+token+jsv
// var crypto = require("crypto");
// var id = crypto.randomBytes(8).toString('hex');

const crypto = require('crypto');
// const { response } = require('express');

const createToken = () => crypto.randomBytes(8).toString('hex');

const validEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || email === '') {
    // console.log("oi");
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }

  const regex = /\S+@\S+\.\S+/;
  if (!regex.test(email)) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  next();
};

const validPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || password === '') {
    return res.status(400).json({
      message: 'O campo "password" é obrigatório',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }
  next();
};

app.post('/login', validEmail, validPassword, (_req, res) => {
  const token = createToken();
  return res.status(200).json({ token });
});

// 4. A requisição deve ter o token de autenticação nos headers

const validToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: 'Token não encontrado',
    });
  }
  if (token.length < 16) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
  next();
};

// 4. O campo name deverá ter no mínimo 3 caracteres e obrigatorio

const validName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  }
  if (name.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  next();
};

// 4. O campo age deverá ser um inteiro e apenas pessoas maiores de idade (pelo menos 18 anos) podem ser cadastrados.

const validAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({
      message: 'O campo "age" é obrigatório',
    });
  }
  if (Number(age) <= 18) {
    return res.status(400).json({
      message: 'A pessoa palestrante deve ser maior de idade',
    });
  }
  next();
};

// 4 O campo talk deverá ser um objeto com as seguintes chaves...

// referencia do regex ----> https://stackoverflow.com/questions/15196451/regular-expression-to-validate-datetime-format-mm-dd-yyyy
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

const validDate = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt } = talk;

  if (!watchedAt) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }

  if (!watchedAt.match(dateRegex)) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
};

const validRate = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;

  if (!rate) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }

  if (Number(rate) < 1 || Number(rate) > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
  }
  next();
};

const validTalk = (req, res, next) => {
  const { talk } = req.body;

  if (!talk || talk === '') {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }

  validRate(req, res);
  validDate(req, res);

  next();
};

app.post('/talker', 
  validToken,
  validName,
  validTalk,
  validDate,
  validRate,
  validAge,
  async (req, res) => {
    const { age, name, talk } = req.body;
    const people = JSON.parse(fs.readFileSync(TALKER, 'utf-8'));
    const id = people.length + 1;
    const person = { name, age, id, talk };
    const newPeople = people.push(person);
    fs.writeFileSync(TALKER, JSON.stringify(newPeople));
    return res.status(201).json({
      id,
      name,
      age,
      talk,
    });
  });