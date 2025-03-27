function getLanding(req, res) {
  if (!req.isAuthenticated()) {
    res.render("landing/landing-page");
  }
  res.redirect('/dashboard');
}




module.exports = {
  getLanding: getLanding,
};
