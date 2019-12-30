const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/authRouter");

const server = express();
server.use(cors());
server.use(express.json());

server.use("/auth", authRouter);

module.exports = server;
