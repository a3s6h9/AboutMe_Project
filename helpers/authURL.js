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
    let transporter = nodemailer.createTransport(smtpTransport({
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
      
    let mailOptions = {
      from: process.env.Y_MAIL,
      to: uEmail,
      subject: 'Verify Your AboutMe Acccount',
      html: `<h3>please click on the link below to confirm your Account</h3>
            <a href="${url}">${url}</a>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });  
  },

  passReset: (email) => {
    let transporter = nodemailer.createTransport(smtpTransport({
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
      data: email
    }, process.env.JWT_SEC, { expiresIn: 60 * 60 });

    const url = `https://warm-dawn-89730.herokuapp.com/users/forgot/reset/${token}`;

    let mailOptions = {
      from: `"AboutMe" <${process.env.Y_MAIL}>`,
      to: email,
      subject: 'Reset your AboutMe account password',
      html: `<h3>please click on the link below to reset your AboutMe password</h3>
            <p>This link will be available to you for 1 hour.</p>
            <a href="${url}">${url}</a>`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info);
      }
    });

    return {
      token
    }

  }
}




