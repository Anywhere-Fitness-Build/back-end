const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/authRouter");
const classRouter = require("./routes/classRouter");
const authMiddleware = require("./middleware/authMiddleware");

const server = express();
server.use(cors());
server.use(express.json());

server.get("/test", (req, res) => {
  res.status(200).json({ message: "This is a test." });
});

server.use("/auth", authRouter);
server.use("/classes", authMiddleware, classRouter);

module.exports = server;
