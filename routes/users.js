const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = require('express').Router();

const {checkSpaces} = require('../helpers/authURL');

// Users Model
require('../models/user');
const User = mongoose.model('User');

router.get('/register', (req, res) => {
  res.render('users/register', {
  active_register: true 
  });
});

router.get('/login', (req, res) => {
  res.render('users/login', {
    active_login: true
  });
});

// User Register
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({message: 'passwords do not match!'});
  } else if (req.body.password.length < 5) {
    errors.push({message: 'password must be atleast 5 characters!'});
  } else if (req.body.cell.length < 10 || req.body.cell.length > 10) {
    errors.push({message: 'please enter a valid Phone number'});
  } else if (checkSpaces(req.body.name)) {
    errors.push({message:  `sorry you can't put white spaces in your name`});
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      phone: req.body.cell,
      email: req.body.email
    });

  } else {
    User.findOne({email: req.body.email}).then( user => {
      if (user) {
        req.flash('error_msg', `This email already exists`);
        res.redirect('/users/register');
      }
    });

   User.findOne({name: req.body.name}).then( user => {
    if (user) {
      req.flash('error_msg', `This username already exists`);
      res.redirect('/users/register');
    }
   });

   User.findOne({phone: req.body.cell}).then( user => {
    if (user) {
      req.flash('error_msg', `This phone number already exists`);
      res.redirect('/users/register');

    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.cell,
        password: req.body.password
      });

      bcrypt.genSalt(10, (errors, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser.save().then( user => {
            req.flash('success_msg', `Tank you for registering ${user.name}, u can now Login`);
            res.redirect('/users/login');
          }).catch( e => console.log(e));
        });
      });
    }
   }).catch( e => console.log(e));
  }
});

router.post('/login', (req, res, nxt) => {
  passport.authenticate('local', {
    successRedirect: '/me',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, nxt);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'you are logged out');
  res.redirect('/users/login');
});

module.exports = router;