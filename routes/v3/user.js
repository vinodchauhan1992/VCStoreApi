const express = require("express");
const router = express.Router();
const user = require("../../controller/v3/user");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/allUsers", user.getAllUser);
router.post("/userByID", user.getUserByID);
router.post("/addNewUser", upload, user.addNewUser);
router.post("/updateUser", upload, user.updateUser);
router.post("/deleteUser", user.deleteUser);
router.post("/changeUserPassword", user.changeUserPassword);
router.post("/userByUsername", user.getUserByUsername);
router.post("/userByEmail", user.getUserByEmail);
router.post("/userByPhone", user.getUserByPhone);
router.post("/updateUserRole", user.updateUserRole);
router.post("/updateUserStatus", user.updateUserStatus);
router.post("/updateNameOfUser", user.updateNameOfUser);
router.post("/updateUserDateOfBirth", user.updateUserDateOfBirth);
router.post("/updateUserGender", user.updateUserGender);
router.post("/updateUserPhone", user.updateUserPhone);
router.post("/updateUserAddress", user.updateUserAddress);
router.post("/updateUserPhoto", upload, user.updateUserPhoto);

module.exports = router;
