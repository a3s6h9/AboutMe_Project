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
  }
}




