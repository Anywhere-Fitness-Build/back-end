if (!process.env.NODE_ENV || process.env.NODE_ENV != "production")
  require("dotenv").config();

const server = require("./server");
const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
