const User = require("../model/user");
const jwt = require("jsonwebtoken");

var dataObject = { status: "success", message: "", data: {} };

module.exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || username === "") {
    dataObject.status = "error";
    dataObject.message = "Please provide username.";
    res.json(dataObject);
  } else if (!password || password === "") {
    dataObject.status = "error";
    dataObject.message = "Please provide password.";
    res.json(dataObject);
  } else {
    User.findOne({
      username: username,
      password: password,
    })
      .then((user) => {
        if (user && Object.keys(user).length > 0) {
          dataObject.status = "success";
          dataObject.message = "User loggedin successfully.";
          dataObject.data = {
            user: user,
            jwtToken: jwt.sign({ user: username }, "secret_key"),
          };
        } else {
          dataObject.message = `There is no user exists with username ${username}.`;
          dataObject.data = {};
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        dataObject.data = {};
        res.json(dataObject);
      });
  }
};
