const db = require("../database/dbConfig");

module.exports = {
  find,
  findById,
  getUserByUsername,
  add
};

function find() {
  return db("users");
}

function findById(id) {
  return db("users")
    .select("*")
    .where({ id })
    .first();
}

function getUserByUsername(username) {
  return db("users")
    .select("*")
    .where({ username })
    .first();
}

function add(user) {
  return db("users")
    .insert(user, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}
