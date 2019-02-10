const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

// POST is authorized
router.post('/register', (req, res) => {
  // console.log(req.body);
  // res.json({
  //   ok: true
  // })
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (!login || !password || !passwordConfirm) {
    res.json({
      ok: false,
      error: 'All fields must be fulfilled!',
      fields: ['login', 'password', 'passwordConfirmation']
    });
  } else if (login.length < 3 || login.length > 16) {
    res.json({
      ok: false,
      error: 'Login length must be from 3 and up to 16 characters!',
      fields: ['login']
    });
  } else if (password !== passwordConfirm ) {
    res.json({
      ok: false,
      error: 'Password doesn\'t match!',
      fields: ['password', 'passwordConfirm']
    });
  } else {

    models.User.findOne({
      login
    }).then(user => {
      if (!user) {
        bcrypt.hash(password, null, null, (err, hash) => {
          models.User.create({
            login,
            password: hash
          }).then(user => {
            console.log(user);
            res.json({
              ok: true
            });
          }).catch(err => {
            console.log(err);
            res.json({
              ok: false,
              error: 'Error, try again later!'
            });
          });
        });
      } else {
        res.json({
          ok: false,
          error: 'Name is ocuppied!',
          fields: ['login']
        });
      }
    });
  }
});

module.exports = router;