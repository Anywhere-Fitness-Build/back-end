const db = require("../database/dbConfig");

module.exports = {
  find,
  add,
  findById,
  findWithFilter,
  findByInstructorId,
  getAttendingUsers,
  findUsersClasses,
  removeById,
  addAttendee,
  updateClass,
  removeAttendee,
  getAttendee
};

function find() {
  return db("classes as cl")
    .select(
      "cl.id",
      "cl.instructor_id",
      "u.username as instructor_name",
      "cl.name",
      "cl.type",
      "cl.startTime",
      "cl.duration",
      "cl.intensity",
      "cl.location",
      "cl.maxSize"
    )
    .join({ u: "users" }, "cl.instructor_id", "=", "u.id");
}

function findWithFilter(filter) {
  return db("classes")
    .select("*")
    .where(filter);
}

function updateClass(updatedInfo, id) {
  return db("classes")
    .update(updatedInfo)
    .where({ id });
}

function add(classObj) {
  return db("classes")
    .insert(classObj, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

function removeById(id) {
  return db("classes")
    .where({ id })
    .del();
}

function findById(id) {
  return db("classes as cl")
    .select(
      "cl.id",
      "cl.instructor_id",
      "u.username as instructor_name",
      "cl.name",
      "cl.type",
      "cl.startTime",
      "cl.duration",
      "cl.intensity",
      "cl.location",
      "cl.maxSize"
    )
    .join({ u: "users" }, "cl.instructor_id", "=", "u.id")
    .where({ "cl.id": id })
    .first();
}

function findByInstructorId(instructor_id) {
  return db("classes")
    .select("*")
    .where({ instructor_id });
}

function getAttendingUsers(class_id) {
  return db("class_attendees as ca")
    .select("u.username", "u.id")
    .join({ u: "users" }, "ca.user_id", "=", "u.id")
    .where({ class_id });
}

function findUsersClasses(user_id) {
  return db("class_attendees as ca")
    .select(
      "c.id",
      "c.instructor_id",
      "c.name",
      "c.type",
      "c.startTime",
      "c.duration",
      "c.intensity",
      "c.location",
      "c.maxSize"
    )
    .join({ c: "classes" }, "ca.class_id", "=", "c.id")
    .where({ user_id });
}

function addAttendee(class_id, user_id) {
  return db("class_attendees").insert({ class_id, user_id });
}

function getAttendee(class_id, user_id) {
  return db("class_attendees")
    .select("*")
    .where({ class_id, user_id })
    .first();
}

function removeAttendee(class_id, user_id) {
  return db("class_attendees")
    .where({ class_id, user_id })
    .del();
}
