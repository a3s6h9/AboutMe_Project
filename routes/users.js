const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const router = require('express').Router();

const {checkSpaces, confirmEmail,passReset} = require('../helpers/authURL');

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
  } else if (checkSpaces(req.body.name)) {
    errors.push({message:  `sorry you can't put white spaces in your name`});
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
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

    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (errors, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser.save().then( user => {
            req.flash('success_msg', `Tank you for registering ${user.name}, Confirmation link is sent to your Email`);
            confirmEmail(user._id, user.email);
            res.redirect('/users/login');
          }).catch( e => console.log(e));
        });
      });
    }
   }).catch( e => console.log(e));
  }
});

// email confirmation URL
router.get('/confirm/:token', (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_SEC);

  User.findOneAndUpdate({_id: decoded.data}, {$set: {confirmed: true}}, {new: true}).then( user => {
    req.flash('success_msg', `congractulations you have been verified, you can now log in.`);
    res.redirect('/users/login');
  }).catch( e => console.log(e));

});

router.get('/forgot', (req, res) => {
  res.render('users/forgot');
});


router.post('/forgot', (req, res) => {
  const f_pwdemail = req.body.f_pwdemail;

  User.findOne({email: f_pwdemail}).then( user => {
    if (user) {
      const resetToken = passReset(f_pwdemail);
      user.resetToken = resetToken.token;
      console.log(user);
      res.render('users/greetings');
    } else {
      req.flash('error_msg', 'sorry this E-Mail does not exist');
      res.redirect('/users/forgot');
    }
  }).catch( e => console.log(e));
});

router.get('/forgot/reset/:token', (req, res) => {
 const decoded = jwt.verify(req.params.token, process.env.JWT_SEC);
 User.findOne({email: decoded.data}).then( user => {
    if (!user) {
      req.flash('unauthorized request');
      res.redirect('/');
    } else {
      res.render('users/reset');
    }
 });
});

router.post('/forgot/reset', (req, res) => {
 User.findOne({resetToken: req.params.token}).then( user => {
    if (!user) {
      req.flash('unauthorized request');
      res.redirect('/');
    } else {
      console.log(req.headers.referer);
      if (req.body.resetpwd.length < 5 || req.body.resetpwd1.length < 5) {
        req.flash('error_msg', 'password must be more than 4 characters');
        res.redirect(req.headers.referer);
      } else if (req.body.resetpwd !== req.body.resetpwd1) {
        req.flash('error_msg', 'passwords do not match');
        res.redirect(req.headers.referer);
      }
      else {
        bcrypt.genSalt(10, (errors, salt) => {
          bcrypt.hash(req.body.resetpwd, salt, (err, hash) => {
            user.password = hash;
            user.save().then( nuser => {
              console.log(nuser);
              req.flash('success_msg', `your password is now succefully changed you can now Login.`);
              res.redirect('/users/login');
            }).catch( e => console.log(e));
          });
        });
      }
    }
 });
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