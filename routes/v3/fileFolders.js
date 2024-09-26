const express = require("express");
const router = express.Router();
const fileFolders = require("../../controller/v3/fileFolders");

router.get("/allFileFolders", fileFolders.getAllFileFolders);
router.get("/fileFolderByID/:fileFolderID", fileFolders.getFileFolderByID);
router.post("/addFileFolder", fileFolders.addFileFolder);
router.delete("/deleteFileFolder/:fileFolderID", fileFolders.deleteFileFolder);

module.exports = router;
