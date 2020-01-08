const db = require("../database/dbConfig");

const Users = require("./usersModel");

describe("users model", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("inserts user into db", () => {
    const user = { username: "testing", password: "testing", role_id: 2 };
    Users.add(user)
      .then(insertedUser => {
        expect(insertedUser).not.toBeNull();
      })
      .catch(err => {
        fail("Insertion failed, error: ", err);
      });
  });

  it("gets role from user", async () => {
    const user = {
      username: "testInstructor",
      password: "testing",
      role_id: 2
    };
    await db("users")
      .insert(user)
      .then(([id]) => {
        return Users.getRoleFromUserId(id);
      })
      .then(roleId => {
        expect(roleId).toBe(2);
      })
      .catch(err => {
        fail("Failed with err", err);
      });
  });
});
