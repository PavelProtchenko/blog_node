const express = require('express');
const app = express();

const data = 'Burger';

app.set('view engine', 'ejs')

app.get('/', (req,res) => res.render('index', {data: data}));

app.listen(8081, () => console.log('Example app listening 8081 port'));
