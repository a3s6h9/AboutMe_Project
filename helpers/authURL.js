const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.G_MAIL,
          pass: process.env.G_PASS
      }
  });
  const mailOpt = {
      from: process.env.G_MAIL,
      to: uEmail,
      subject: 'Confirmation E-Mail',
      html: `<h3>click on the link below to confirm your email</h3> 
              <a href="${url}">${url}</a>`
  }
  
  transporter.sendMail(mailOpt, (err, info) => {
      if (err) throw err;
  
      console.log(info);
  });
  
  const token = jwt.sign({
      data: uvUser._id
  }, process.env.JWT_SEC, { expiresIn: 60 * 60 });
  
  const url = `https://warm-dawn-89730.herokuapp.com/users/confirm/${token}`;
  
  }
}




