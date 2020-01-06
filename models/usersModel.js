const db = require("../database/dbConfig");

module.exports = {
  find,
  findById,
  getUserByUsername,
  add,
  getRoleFromUserId
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

function getRoleFromUserId(id) {
  return db("users")
    .select("role_id")
    .where({ id })
    .first()
    .then(obj => {
      return obj.role_id;
    })
    .catch(() => {
      return -1;
    });
}

function add(user) {
  return db("users")
    .insert(user, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}
