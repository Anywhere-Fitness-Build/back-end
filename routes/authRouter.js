const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "5h"
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
}

module.exports = router;
