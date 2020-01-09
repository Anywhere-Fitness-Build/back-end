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

  it("findById check", async () => {
    const user = { username: "findbyid", password: "testing", role_id: 2 };
    const [id] = await db("users").insert(user);

    await Users.findById(id)
      .then(find => {
        expect(find.username).toBe("findbyid");
      })
      .catch(err => {
        fail(`Findbyid failed with error ${err}`);
      });
  });

  it("getUserByUsername check", async () => {
    const user = { username: "getusername", password: "testing", role_id: 2 };
    await db("users").insert(user);

    await Users.getUserByUsername("getusername")
      .then(found => {
        expect(found.username).toBe("getusername");
      })
      .catch(err => {
        fail(`getuser by username failed with error ${err}`);
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
