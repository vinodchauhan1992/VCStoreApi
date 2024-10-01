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
router.post("/updateUserRole", user.updateUserRole);
router.post("/updateUserStatus", user.updateUserStatus);

module.exports = router;
