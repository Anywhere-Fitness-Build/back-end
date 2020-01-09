const db = require("../database/dbConfig");

const Classes = require("./classModel");

describe("classes model", () => {
  beforeEach(async () => {
    await db("classes").truncate();
    await db("class_attendees").truncate();
  });

  it("inserts class into db", async () => {
    const classObj = {
      name: "Fat 2 Fit",
      instructor_id: 1,
      type: "Cardio",
      startTime: "2020-01-13T16:30:00.000Z",
      duration: "1h",
      intensity: 8,
      location: "San Francisco",
      maxSize: 10
    };

    await Classes.add(classObj)
      .then(newClass => {
        expect(newClass).toEqual(expect.anything());
      })
      .catch(err => {
        fail(`Insertion failed, error: ${err}`);
      });
  });

  it("removes class from db", async () => {
    const classObj = {
      name: "Test Fit",
      type: "Cardio",
      startTime: "2020-01-13T16:30:00.000Z",
      instructor_id: 1,
      duration: "1h",
      intensity: 8,
      location: "San Francisco",
      maxSize: 10
    };

    await db("classes")
      .insert(classObj)
      .then(async ([id]) => {
        await Classes.removeById(id);
        return Classes.findById(id);
      })
      .then(findClass => {
        expect(findClass).toBe(undefined);
      })
      .catch(err => {
        fail(`Test failed with error ${err}`);
      });
  });

  it("adds user attendee to class", async () => {
    //create class
    const classObj = {
      name: "attendee test",
      type: "test",
      startTime: "2020-01-13T16:30:00.000Z",
      instructor_id: 1,
      duration: "1h",
      intensity: 8,
      location: "San Francisco",
      maxSize: 10
    };

    //Get class id from insertion
    const [classId] = await db("classes").insert(classObj);

    //Create user
    const user = { username: "addattendee", password: "testing", role_id: 2 };
    const [userId] = await db("users").insert(user);

    await Classes.addAttendee(classId, userId);

    //Check if insertion is good.
  });
});
