const role = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: `Access restricted to ${requiredRole}s` });
    }
    next();
  };
  
  module.exports = role;