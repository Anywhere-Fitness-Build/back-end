if (!process.env.NODE_ENV || process.env.NODE_ENV != "production")
  require("dotenv").config();

const server = require("./server");
const port = process.env.PORT || 4000;

console.log(`Using environment: ${process.env.NODE_ENV}`);
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
