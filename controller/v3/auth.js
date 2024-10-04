const User = require("../../model/v3/user");
const jwt = require("jsonwebtoken");
const UserUtility = require("../../utilities/v3/userUtility");
const CommonUtility = require("../../utilities/v3/commonUtility");

module.exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || username === "") {
    res.json({
      status: "error",
      message: "Username is required to login.",
      data: {},
    });
    return;
  }
  if (!password || password === "") {
    res.json({
      status: "error",
      message: "Password is required to login.",
      data: {},
    });
    return;
  }
  User.findOne({
    username: username,
    password: password,
  })
    .then(async (user) => {
      if (user && Object.keys(user).length > 0) {
        const fullDetailsUser = await UserUtility.getSingleUserWithAllDetails({
          userData: CommonUtility.sortObject(user),
        });
        if (
          fullDetailsUser?.userStatusDetails?.status &&
          fullDetailsUser.userStatusDetails.status === "Active"
        ) {
          res.json({
            status: "success",
            message: "You are successfully logged in.",
            data: {
              user: fullDetailsUser,
              jwtToken: jwt.sign({ user: username }, "secret_key"),
            },
          });
        } else {
          res.json({
            status: "error",
            message: `You can't login with this user as this user is ${fullDetailsUser.userStatusDetails.status}`,
            data: {},
          });
        }
      } else {
        res.json({
          status: "error",
          message: `There is no user exists with this username ${username} and password.`,
          data: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: {},
      });
    });
};
