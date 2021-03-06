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
  if (req.roleId !== 1) {
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
