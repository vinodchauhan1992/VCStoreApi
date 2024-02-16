const User = require("../model/user");
const CommonUtility = require("../utilities/commonUtility");

var dataObject = { status: "success", message: "", data: [] };

module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  User.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((users) => {
      if (users && users.length > 0) {
        dataObject.message = "Users fetched successfully.";
        dataObject.data = users;
      } else {
        dataObject.message =
          "Users fetched successfully. But users doesn't have any data.";
      }
      res.json(dataObject);
    })
    .catch((err) => {
      dataObject.message = `There is an error occurred. ${err}`;
      dataObject.status = "error";
      res.json(dataObject);
    });
};

module.exports.getUser = (req, res) => {
  if (!req?.params?.id || req.params.id === "") {
    dataObject.status = "error";
    dataObject.message = "Please send user id to get a user by id.";
    res.json(dataObject);
  } else {
    const id = req.params.id;

    User.findOne({
      id,
    })
      .select(["-_id"])
      .then((user) => {
        if (user && Object.keys(user).length > 0) {
          dataObject.message = `User with user id ${id} fetched successfully.`;
          dataObject.data = user;
        } else {
          dataObject.message = `There is no user exists with user id ${id}.`;
          dataObject.data = {};
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        res.json(dataObject);
      });
  }
};

module.exports.addUser = (req, res) => {
  if (typeof req.body == undefined) {
    dataObject.status = "error";
    dataObject.message = "Please send all required data to add a user.";
    res.json(dataObject);
  } else {
    User.findOne({
      username: req.body.username,
    })
      .select(["-_id"])
      .then((user) => {
        if (user && Object.keys(user).length > 0) {
          dataObject.message = `User with username ${req.body.username} is already exists. Please use a different username.`;
          dataObject.data = user;
          res.json(dataObject);
        } else {
          User.findOne({
            email: req.body.email,
          })
            .select(["-_id"])
            .then((user) => {
              if (user && Object.keys(user).length > 0) {
                dataObject.message = `User with email address ${req.body.email} is already exists. Please use a different email address.`;
                dataObject.data = user;
                res.json(dataObject);
              } else {
                User.findOne({
                  username: req.body.username,
                })
                  .select(["-_id"])
                  .then((user) => {
                    if (user && Object.keys(user).length > 0) {
                      dataObject.message = `User with phone ${req.body.email} is already exists. Please use a different phone number.`;
                      dataObject.data = user;
                      res.json(dataObject);
                    } else {
                      const user = new User({
                        id: `${req.body.username}${req.body.phone}`,
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password,
                        name: {
                          firstname: req.body.firstname,
                          lastname: req.body.lastname,
                        },
                        address: {
                          address: req.body.address.address,
                          city: req.body.address.city,
                          state: req.body.address.state,
                          zipcode: req.body.address.zipcode,
                        },
                        phone: req.body.phone,
                        userRole: req.body.userRole,
                        userRoleID: req.body.userRoleID,
                      });
                      user
                        .save()
                        .then((respondedUser) => {
                          if (
                            respondedUser &&
                            Object.keys(respondedUser).length > 0
                          ) {
                            dataObject.message = `New user is added successfully.`;
                            dataObject.data = respondedUser;
                          } else {
                            dataObject.message = `User is not added due to unknown error.`;
                            dataObject.data = {};
                          }
                          res.json(dataObject);
                        })
                        .catch((err) => {
                          dataObject.status = "error";
                          dataObject.message = `User is not added as there is an error occurred. ${err}`;
                          res.json(dataObject);
                        });
                    }
                  })
                  .catch((err) => {
                    dataObject.status = "error";
                    dataObject.message = `User is not added as there is an error occurred in fetching user by phone. ${err}`;
                    res.json(dataObject);
                  });
              }
            })
            .catch((err) => {
              dataObject.status = "error";
              dataObject.message = `User is not added as there is an error occurred in fetching user by email. ${err}`;
              res.json(dataObject);
            });
        }
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `User is not added as there is an error occurred in fetching user by username. ${err}`;
        res.json(dataObject);
      });
  }
};

module.exports.editUser = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    dataObject.status = "error";
    dataObject.message = "something went wrong! check your sent data.";
    res.json(dataObject);
  } else {
    res.json({
      id: parseInt(req.params.id),
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      name: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      },
      address: {
        address: req.body.address.address,
        city: req.body.address.city,
        state: req.body.address.state,
        zipcode: req.body.zipcode,
      },
      phone: req.body.phone,
      userRole: req.body.userRole,
      userRoleID: req.body.userRoleID,
    });
  }
};

module.exports.deleteUser = (req, res) => {
  if (req.params.id == null) {
    dataObject.status = "error";
    dataObject.message = "User id must be provided to delete a product.";
    res.json(dataObject);
  } else {
    User.findOne({ id: req.params.id })
      .select(["-_id"])
      .then((user) => {
        if (user && Object.keys(user).length > 0) {
          dataObject.message = `User with user id ${id} is deleted successfully.`;
          dataObject.data = user;
        } else {
          dataObject.message = `User with user id ${id} is not deleted.`;
          dataObject.data = {};
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        res.json(dataObject);
      });
  }
};
