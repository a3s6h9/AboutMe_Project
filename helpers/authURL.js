module.exports = {
  ensureauthorized: (req, res, nxt) => {
    if (req.isAuthenticated()) {
      return nxt();
    }
    req.flash('error_msg', 'not authorized, please Login');
    res.redirect('/users/login');
  },
}
