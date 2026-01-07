module.exports = {
  secret: process.env.JWT_SECRET || "super_secret_key",
  expiresIn: "8h"
};
