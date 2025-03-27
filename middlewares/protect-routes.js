function protectRoutes(req, res, next) {
    if (!res.locals.isAuthenticated) {
      return res.redirect("/401");
    }
    next();
  }
  
  module.exports = protectRoutes;
  