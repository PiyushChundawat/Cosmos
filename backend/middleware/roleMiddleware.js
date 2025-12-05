// Generic role-based middleware
const allowRoles = (...roles) => {
  return (req, res, next) => {
    // authMiddleware must run before this
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

module.exports = { allowRoles };