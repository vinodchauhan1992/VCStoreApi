const FileFolders = require("../../model/v3/fileFolders");
const CommonUtility = require("../../utilities/v3/commonUtility");

let dataObject = { status: "success", message: "", data: [] };

module.exports.getAllFileFolders = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  FileFolders.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((fileFoldersData) => {
      if (fileFoldersData && fileFoldersData.length > 0) {
        res.json({
          status: "success",
          message: "File folders fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(fileFoldersData),
        });
      } else {
        res.json({
          status: "success",
          message:
            "File folders fetched successfully. But file folders doesn't have any data.",
          data: [],
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: [],
      });
    });
};

module.exports.getFileFolderByID = (req, res) => {
  if (!req?.params?.fileFolderID || req.params.fileFolderID === "") {
    dataObject.status = "error";
    dataObject.message = "File folder id should be provided";
    res.json(dataObject);
  } else {
    const fileFolderID = req.params.fileFolderID;

    FileFolders.findOne({
      id: fileFolderID,
    })
      .select(["-_id"])
      .then((fileFolder) => {
        if (fileFolder && Object.keys(fileFolder).length > 0) {
          res.json({
            status: "success",
            message: `File folder with fileFolderID ${fileFolderID} fetched successfully.`,
            data: CommonUtility.sortObject(fileFolder),
          });
        } else {
          res.json({
            status: "error",
            message: `There is no file folder exists with fileFolderID ${fileFolderID}.`,
            data: [],
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "error",
          message: `There is an error occurred. ${err}`,
          data: [],
        });
      });
  }
};

module.exports.addFileFolder = (req, res) => {
  if (typeof req.body == undefined) {
    dataObject.status = "error";
    dataObject.message = "Please send all required data to add an file folder.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    if (!req?.body?.folderName || req.body.folderName == "") {
      dataObject.status = "error";
      dataObject.message = "Folder name is required.";
      dataObject.data = {};
      res.json(dataObject);
    } else {
      if (!req?.body?.description || req.body.description == "") {
        dataObject.status = "error";
        dataObject.message = "Folder description is required.";
        dataObject.data = {};
        res.json(dataObject);
      } else {
        const folderName = req.body.folderName;

        if (!CommonUtility.isValidWithSpecialCharactersNotAllowed(folderName)) {
          dataObject.status = "error";
          dataObject.message =
            "Special characters are not allowed in folder name.";
          dataObject.data = {};
          res.json(dataObject);
        } else {
          const fileFolder = new FileFolders({
            id: CommonUtility.getUniqueID(),
            folderName: req.body.folderName,
            description: req.body.description,
            dateAdded: new Date(),
            dateModified: new Date(),
          });

          fileFolder
            .save()
            .then((respondedFileFolder) => {
              if (
                respondedFileFolder &&
                Object.keys(respondedFileFolder).length > 0
              ) {
                dataObject.status = "success";
                dataObject.message = `New file folder is added successfully.`;
                dataObject.data = respondedFileFolder;
              } else {
                dataObject.status = "error";
                dataObject.message = `File folder is not added due to unknown error.`;
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
      }
    }
  }
};

module.exports.deleteFileFolder = (req, res) => {
  if (req.params.fileFolderID == null) {
    dataObject.status = "error";
    dataObject.message =
      "File folder id must be provided to delete a user role.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    const fileFolderID = req.params.fileFolderID;
    FileFolders.deleteOne({
      id: fileFolderID,
    })
      .select(["-_id"])
      .then((result) => {
        if (result && result.deletedCount === 1) {
          dataObject.status = "success";
          dataObject.message = `File folder with file folder id ${fileFolderID} is deleted successfully.`;
          dataObject.data = {};
        } else {
          dataObject.status = "error";
          dataObject.message = `File folder with file folder id ${fileFolderID} is not deleted.`;
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
