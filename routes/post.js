const express = require('express');
const router = express.Router();
const TurndownService = require('turndown');

const models = require('../models');
// GET for add post
router.get('/add', (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.redirect('/')
  } else {
    res.render('post/add', {
      user: {
        id: userId,
        login: userLogin
      }
    });
  }
});

// POST is for post add
router.post('/add', (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.redirect('/')
  } else {
    const title = req.body.title.trim().replace(/ +(?= )/g, '');
    const body = req.body.body;
    const turndownService = new TurndownService()

    if (!title || !body) {
      const fields = [];
      if (!title) fields.push('title');
      if (!body) fields.push('body');

      res.json({
        ok: false,
        error: 'All fields must be fulfilled!',
        fields
      });
    } else if (title.length < 3 || title.length > 64) {
      res.json({
        ok: false,
        error: 'Title length must be from 3 and up to 64 characters!',
        fields: ['title']
      });
    } else if (body.length < 1) {
      res.json({
        ok: false,
        error: 'Body length must be from 1 and up to infinite characters!',
        fields: ['body']
      });
    } else {
      models.Post.create({
        title,
        body: turndownService.turndown(body),
        owner: userId
      }).then(post => {
        console.log(post);
        res.json({
          ok: true
        });
      }).catch(err => {
        console.log(err);
        res.json({
          ok: false
        });
      })
    }
  }
});

module.exports = router;