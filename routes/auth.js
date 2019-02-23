const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

// POST is registered
router.post('/register', (req, res) => {
  // console.log(req.body);
  // res.json({
  //   ok: true
  // })
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (!login || !password || !passwordConfirm) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');
    if (!passwordConfirm) fields.push('passwordConfirm');

    res.json({
      ok: false,
      error: 'All fields must be fulfilled!',
      fields
    });
  } else if (!/^[A-Za-z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Only latin letters and numbers!',
      fields: ['login']
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
  } else if (password.length < 5 ) {
    res.json({
      ok: false,
      error: 'Password length is too short, enter more than 5 characters!',
      fields: ['password']
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
            req.session.userId = user.id;
            req.session.userLogin = user.login;
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

// POST is logged in
router.post('/login', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    const fields = [];
    if (!login) fields.push('login')
    if (!password) fields.push('password')

    res.json({
      ok: false,
      error: 'All fields must be fulfilled!',
      fields
    });
  } else {
    models.User.findOne({
      login
    }).then(user => {
      if (!user) {
        res.json({
          ok: false,
          error: 'Login or password don\'t match!',
          fields: ['login', 'password']
        });
      } else {
        bcrypt.compare(password, user.password, (err, response) => {
          console.log(response);
          if (!response) {
            res.json({
              ok: false,
              error: 'Login or password don\'t match!',
              fields: ['login', 'password']
            });
          } else {
            req.session.userId = user.id;
            req.session.userLogin = user.login;
            res.json({
              ok: true
            });
          }
        });
      }
    }).catch(err => {
      console.log(err);
      res.json({
        ok: false,
        error: 'Error, try again later!'
      });
    });
  }
});

// Get for logout
router.get('/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;