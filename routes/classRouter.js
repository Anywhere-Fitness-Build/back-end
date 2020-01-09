const express = require("express");
const Classes = require("../models/classModel");
const router = express.Router();
const roleMiddleware = require("../middleware/getRoleMiddleware");

//Get list of all classes
router.get("/", (req, res) => {
  Classes.find()
    .then(classes => {
      res.status(200).json(classes);
    })
    .catch(err => {
      console.log("Error getting list of classes: ", err);
      res
        .status(500)
        .json({ message: "There was a server error getting list of classes" });
    });
});

//Get a specific class by id
router.get("/:classId", verifyClassId, (req, res) => {
  res.status(200).json(req.classObj);
});

//Get list of attendees by class id
router.get("/:classId/attendees", verifyClassId, (req, res) => {
  const classId = req.params.classId;
  Classes.getAttendingUsers(classId)
    .then(attendees => {
      res.status(200).json(attendees);
    })
    .catch(err => {
      console.log("There was an error retrieving attendees by class id", err);
      res
        .status(500)
        .json({ message: "There was a server error retrieving the data." });
    });
});

router.get("/:classId/attendees/size", verifyClassId, (req, res) => {
  const classId = req.params.classId;
  Classes.getAttendingUsers(classId)
    .then(attendees => {
      res.status(200).json({ size: attendees.length });
    })
    .catch(err => {
      console.log("There was an error retrieving attendees by class id", err);
      res
        .status(500)
        .json({ message: "There was a server error retrieving the data." });
    });
});

router.post("/:classId/attendees", verifyClassId, (req, res) => {
  //Check if they are already in the class
  const userId = req.token.subject;
  const classId = req.params.classId;

  Classes.getAttendee(classId, userId)
    .then(attendee => {
      if (attendee) {
        //Already exists.
        res.status(400).json({ message: "This user is already attending." });
      } else {
        //Check if class is full
        Classes.getAttendingUsers(classId).then(attending => {
          Classes.findById(classId)
            .then(classObj => {
              if (attending.length < classObj.maxSize) {
                //Add to class
                Classes.addAttendee(classId, userId)
                  .then(() => {
                    res.status(200).json({ message: "User added to class" });
                  })
                  .catch(err => {
                    console.log(
                      "There was an error trying to add attendee to class by id",
                      err
                    );
                    res.status(500).json({
                      message:
                        "There was a server error trying to add attendee to class"
                    });
                  });
              } else {
                res.status(400).json({
                  message:
                    "Class is full (at max size), cannot add any more attendees"
                });
              }
            })
            .catch(err => {
              console.log("Error finding class by id: ", err);
              res.status(500).json({
                message: "There was a server error trying to find class by id"
              });
            });
        });
      }
    })
    .catch(err => {
      console.log("error getting attendee: ", err);
      res.status(500).json({
        message: "There was a server error trying to check if attendee exists"
      });
    });
});

router.delete("/:classId/attendees", verifyClassId, (req, res) => {
  const userId = req.token.subject;
  const classId = req.params.classId;

  //Check if user is in class
  Classes.getAttendee(classId, userId)
    .then(attendee => {
      if (attendee) {
        Classes.removeAttendee(classId, userId)
          .then(() => {
            res.status(200).json({ message: "User removed from class" });
          })
          .catch(err => {
            console.log("Error removing attendee", err);
            res.status(500).json({
              message:
                "There was a server error trying to remove the attendee from the class"
            });
          });
      } else {
        res.status(400).json({
          message:
            "The user cannot be removed because the user is already not attending"
        });
      }
    })
    .catch(err => {
      console.log("Error trying to verify attendee, ", err);
      res.status(500).json({
        message: "There was a server error trying to verify attendee"
      });
    });
});

//Update class by id
router.put("/:classId", verifyClassId, (req, res) => {
  const body = req.body;
  Classes.updateClass(body, req.params.classId)
    .then(updatedRecords => {
      res.status(200).json({ updatedRecords });
    })
    .catch(err => {
      console.log("Error trying to update class by id: ", err);
      res.status(500).json({
        message: "There was an error trying to update the class.",
        error: err.message
      });
    });
});

//Delete a class
router.delete("/:classId", verifyClassId, (req, res) => {
  Classes.findById(req.params.classId)
    .then(classObj => {
      if (classObj.instructor_id === req.token.subject) {
        return Classes.removeById(req.params.classId);
      } else {
        res.status(403).json({
          message:
            "You must be the instructor of this class to delete this class"
        });
      }
    })
    .then(() => {
      res.status(200).json({ message: "Class deleted" });
    })
    .catch(err => {
      console.log("error deleting class by id: ", err);
      res
        .status(500)
        .json({ message: "Server error, could not remove class by id" });
    })
    .catch(err => {
      console.log("error: ", err);
      res.status(500).json({
        message: "There was a server error while trying to delete a class"
      });
    });
});

// Need name, type, startTime, duration, intensity, location, and maxSize
//Must be an instructor to create a class.
router.post("/", roleMiddleware, (req, res) => {
  //Check to see if user is an instructor
  if (req.roleId !== 2) {
    res
      .status(403)
      .json({ message: "Must be an instructor to create classes" });
    return;
  }

  //Check if body contains all required fields
  const body = req.body;
  if (
    !body.name ||
    !body.type ||
    !body.startTime ||
    !body.duration ||
    !body.intensity ||
    !body.location ||
    !body.maxSize
  ) {
    res.status(400).json({
      message:
        "name, type, startTime, duration, intensity, location, and maxSize fields are required"
    });
  } else {
    const newClass = { ...body, instructor_id: req.token.subject };

    //Create class
    Classes.add(newClass)
      .then(classObj => {
        res.status(201).json(classObj);
      })
      .catch(err => {
        console.log("Error making class", err);
        res.status(500).json({
          message: "There was an error in the server trying to add the class"
        });
      });
  }
});

//Middleware to verify if a class exists with the given id parameter
function verifyClassId(req, res, next) {
  const { classId } = req.params;
  Classes.findById(classId)
    .then(classObj => {
      if (classObj) {
        req.classObj = classObj;
        next();
      } else {
        res
          .status(404)
          .json({ message: `Class with id of ${classId} does not exist.` });
      }
    })
    .catch(err => {
      console.log("Error verifying class by class id", err);
      res
        .status(500)
        .json({ message: "There was a server error verifying the class id" });
    });
}

module.exports = router;
