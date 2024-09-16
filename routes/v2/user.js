const express = require("express");
const router = express.Router();
const user = require("../../controller/v2/user");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.get("/allUsers", user.getAllUser);
router.get("/userByID/:userID", user.getUserByID);
router.post("/addNewUser", upload, user.addNewUser);
router.put("/updateUser/:userID", upload, user.updateUser);
router.delete("/deleteUser/:userID", user.deleteUser);
router.put("/changeUserPassword/:userID", user.changeUserPassword);
router.put("/updateUserRole/:userID", user.updateUserRole);
router.put("/updateUserStatus/:userID", user.updateUserStatus);

module.exports = router;
