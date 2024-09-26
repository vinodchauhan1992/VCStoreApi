const express = require("express");
const router = express.Router();
const fileUploader = require("../../controller/v3/fileUploader");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/uploadImage", upload, fileUploader.uploadFileToFirebaseStorage);

module.exports = router;
