const lS = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');

module.exports = (passport) => {
  passport.use(new lS({usernameField: 'email'}, (email, password, done) => {
    User.findOne({
      email
    }).then( user => {
      if (!user) {
        return done(null, false, {message: 'No user found!'});
      } else if (user.confirmed != true ) {
        return done(null, false, {message: 'please confirm your Email, verification link is sent to yout email!'});
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'please check your password'});
        }
      })
    });
  }));
  

  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
