const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/usersModel");
const authMiddleware = require("../middleware/authMiddleware");

function getRoleToId(isInstructor) {
  return isInstructor ? 2 : 1;
}

router.get("/", (req, res) => {
  res.status(200).json({ message: "I am here!" });
});

router.post("/register", (req, res) => {
  const body = req.body;
  if (
    !body.username ||
    !body.password ||
    !body.hasOwnProperty("isInstructor")
  ) {
    res.status(400).json({
      message: "username, password, and isInstructor fields are required"
    });
  } else {
    const hashedPass = bcrypt.hashSync(body.password, 8);
    const role_id = getRoleToId(body.isInstructor);

    Users.add({ username: body.username, password: hashedPass, role_id })
      .then(newUser => {
        delete newUser.password;
        res.status(201).json(newUser);
      })
      .catch(err => {
        console.log("There was an error registering user", err);
        res
          .status(500)
          .json({ message: "There was a server error registering a user" });
      });
  }
});

router.post("/login", (req, res) => {
  const body = req.body;
  if (!body.username || !body.password) {
    res
      .status(400)
      .json({ message: "username and password fields are required " });
  } else {
    Users.getUserByUsername(body.username).then(dbUser => {
      if (dbUser && bcrypt.compareSync(body.password, dbUser.password)) {
        const token = generateToken(dbUser);
        res.status(200).json({ message: "Welcome! here's your token", token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    });
  }
});

router.get("/whoami", authMiddleware, (req, res) => {
  const { subject, username } = req.token;
  res.status(200).json({ id: subject, username });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "24h"
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
}

module.exports = router;
