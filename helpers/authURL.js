const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
  ensureauthorized: (req, res, nxt) => {
    if (req.isAuthenticated()) {
      return nxt();
    }
    req.flash('error_msg', 'not authorized, please Login');
    res.redirect('/users/login');
  },

  checkSpaces: (name) =>  {
    let trimmed = name.trim();
    let final = trimmed.indexOf(' ');
    if (final != -1) {
      return true;
    } else {
      return false;
    }
  },

  confirmEmail: (uvUser, uEmail) => {  
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'yahoo',
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: false,
    auth: {
      user: process.env.Y_MAIL,
      pass: process.env.Y_PASS
    }
  }));

  const token = jwt.sign({
    data: uvUser._id
  }, process.env.JWT_SEC, { expiresIn: 60 * 60 });

  const url = `https://warm-dawn-89730.herokuapp.com/users/confirm/${token}`;
    
  var mailOptions = {
    from: process.env.Y_MAIL,
    to: uEmail,
    subject: 'verify your AboutMe Acccount',
    html: `<p>please click on the link below to confirm your Account
          <a href="${url}">${url}</a>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });  
  }
}




