function authorizeRole() {
  var allowedRoles = Array.prototype.slice.call(arguments);

  return function (req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: "Access denied: user role is required to access this resource."
      });
    }

    var userRole = req.user.role;
    var isAllowed = false;

    for (var i = 0; i < allowedRoles.length; i++) {
      if (allowedRoles[i] === userRole) {
        isAllowed = true;
        break;
      }
    }

    if (!isAllowed) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions."
      });
    }

    next();
  };
}

module.exports = authorizeRole;

