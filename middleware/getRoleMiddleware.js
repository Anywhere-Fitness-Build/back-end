const Users = require("../models/usersModel");

module.exports = (req, res, next) => {
  if (req.token) {
    Users.getRoleFromUserId(req.token.subject)
      .then(roleId => {
        req.roleId = roleId;
        console.log("Role of user: ", req.roleId);
        next();
      })
      .catch(err => {
        console.log("error getting role id: ", err);
        res.status(500).json({
          message: "There was a server error trying to get the role id from db"
        });
      });
  } else {
    console.log("No decoded token available!");
    res.status(500).json({
      message: "There was an error, could not find token in role middleware"
    });
  }
};
