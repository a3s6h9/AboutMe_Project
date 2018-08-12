const router = require('express').Router();
const mongoose = require('mongoose');

const {ensureauthorized} = require('../helpers/authURL');

// Thoughts Model
require('../models/thoughts');
const Thought = mongoose.model('Thought');

// User Model
require('../models/user');
const User = mongoose.model('User');

router.get('/', ensureauthorized, (req, res) => {
  Thought.find({for: req.user.name}).then( thought => {
    res.render('me/', {
      thought
    });
  }).catch( e => console.log(e));
});

router.get('/:name/write', (req, res) => {
  User.findOne({name: req.params.name}).then( user => {
    if (!user) {
      req.flash('error_msg', 'stop bitchin bruh, and sign up');
      res.redirect('/users/register')
    } else {
      res.render('me/write', {
        name: req.params.name
      });
    }
  });
});

router.post(`/:name/write`, (req, res) => {
  User.findOne({name: req.params.name}).then( user => {
    if (!user) {
      req.flash('error_msg', 'stop bitchin bruh, and sign up');
      res.redirect('/users/register');
    } else {
      const thought = new Thought({
        text: req.body.thought,
        for: req.params.name
      });
      thought.save().then( thought => {
        req.flash('success_msg', 'your message sent successfully and anonymously!');
        res.redirect('/users/register');
      }).catch( e => {
        console.log(e);
      });
    }
  });
});

// Delete Idea
router.delete('/:id', ensureauthorized, (req, res) => {
  Thought.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Thought removed successfully');
      res.redirect('/me');
    });
});

module.exports = router;