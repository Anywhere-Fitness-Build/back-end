const express = require("express");
const Classes = require("../models/classModel");
const router = express.Router();

// Need instructor id, name, type, startTime, duration, intensity, location, and maxSize
router.post("/", (req, res) => {
  const body = req.body;
  if (
    !body.instructor_id ||
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
        "instructor_id, name, type, startTime, duration, intensity, location, and maxSize fields are required"
    });
  } else {
    Classes.add(body)
      .then(obj => {})
      .catch(err => {
        console.log("Error making class", err);
        res.status(500).json({
          message: "There was an error in the server trying to add the class"
        });
      });
  }
});

module.exports = router;
