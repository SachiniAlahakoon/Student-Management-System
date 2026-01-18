
function authorizeRole() {
  // Convert the arguments object to a proper array of allowed roles
  var allowedRoles = Array.prototype.slice.call(arguments);

  return function (req, res, next) {
    // Check if req.user exists and has a role
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: "Access denied: user role is required to access this resource."
      });
    }

    var userRole = req.user.role;
    var isAllowed = false;

    // Check if the user's role is in the allowed roles
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

    // Role is allowed, proceed
    next();
  };
}

module.exports = authorizeRole;