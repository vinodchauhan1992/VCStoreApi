const User = require("../../model/user");
const jwt = require("jsonwebtoken");

module.exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || username === "") {
    res.json({
      status: "error",
      message: "Username is required to login.",
      data: {},
    });
  } else if (!password || password === "") {
    res.json({
      status: "error",
      message: "Password is required to login.",
      data: {},
    });
  } else {
    User.findOne({
      username: username,
      password: password,
    })
      .then((user) => {
        if (user && Object.keys(user).length > 0) {
          if (user?.userStatus && user.userStatus === "Active") {
            res.json({
              status: "success",
              message: "You are successfully loggedin.",
              data: {
                user: user,
                jwtToken: jwt.sign({ user: username }, "secret_key"),
              },
            });
          } else {
            res.json({
              status: "error",
              message: `You can't login with this user as this user is ${user.userStatus}`,
              data: {},
            });
          }
        } else {
          res.json({
            status: "error",
            message: `There is no user exists with username ${username}.`,
            data: {},
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "error",
          message: `There is an error occurred. ${err}`,
          data: {},
        });
      });
  }
};
