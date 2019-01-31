const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();

//const data = { name: 'Burger',
//               age: 23 };

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const arr = ['hello', 'world', 'test']

app.get('/', (req,res) => res.render('index', {arr: arr}));

app.get('/create', (req,res) => res.render('create'));
app.post('/create', (req,res) => {
  arr.push(req.body.text);
  res.redirect('/');
  console.log(arr);
});

app.listen(config.PORT, () => console.log(`Example app listening ${config.PORT} port`));
