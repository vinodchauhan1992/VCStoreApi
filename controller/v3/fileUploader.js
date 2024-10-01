const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const storage = require("../../firebase/v3/firebaseSettings");
const CommonUtility = require("../../utilities/v3/commonUtility");
const FileFolders = require("../../model/fileFolders");

var dataObject = { status: "success", message: "", data: {} };

module.exports.uploadFileToFirebaseStorage = async (req, res) => {
  if (!req.file) {
    dataObject.status = "error";
    dataObject.message = "Please attach a file to upload.";
    res.json(dataObject);
    return;
  }
  if (!req?.body?.fileFolderID || req.body.fileFolderID === "") {
    dataObject.status = "error";
    dataObject.message =
      "Please send file folder id to upload file to the destination.";
    res.json(dataObject);
    return;
  }
  if (!req?.body?.parentDocumentID || req.body.parentDocumentID == "") {
    dataObject.status = "error";
    dataObject.message = "Parent document id is required.";
    dataObject.data = {};
    res.json(dataObject);
    return;
  }
  if (!req?.body?.parentDocumentName || req.body.parentDocumentName == "") {
    dataObject.status = "error";
    dataObject.message = "Parent document name is required.";
    dataObject.data = {};
    res.json(dataObject);
    return;
  }
  const fileFolderID = req.body.fileFolderID;
  const parentDocumentID = req.body.parentDocumentID;
  const parentDocumentName = req.body.parentDocumentName;

  FileFolders.findOne({
    id: fileFolderID,
  })
    .select(["-_id"])
    .then(async (fileFolder) => {
      if (fileFolder && Object.keys(fileFolder).length > 0) {
        const file = req.file;
        const { fileNameWithExtension } = CommonUtility.getFileDetails(file);

        const imageRef = ref(
          storage,
          `images/${fileFolder.folderName}/${parentDocumentID}/${fileNameWithExtension}`
        );
        const metatype = {
          contentType: file.mimetype,
          name: fileNameWithExtension,
        };
        await uploadBytes(imageRef, file.buffer, metatype)
          .then(async (snapshot) => {
            dataObject.status = "success";
            dataObject.message = `File is uploaded successfully to ${fileFolder.folderName} folder.`;
            const imageUrl = await getDownloadURL(imageRef);
            dataObject.data = {
              fullPath: snapshot.metadata.fullPath,
              name: snapshot.metadata.name,
              size: snapshot.metadata.size,
              dateCreated: snapshot.metadata.timeCreated,
              dateUpdated: snapshot.metadata.updated,
              contentType: snapshot.metadata.contentType,
              imageUrl: imageUrl,
              fileFolderID: fileFolder.id,
              fileFolderName: fileFolder.folderName,
              parentDocumentID: parentDocumentID,
              parentDocumentName: parentDocumentName,
            };
            res.json(dataObject);
          })
          .catch((error) => {
            dataObject.status = "error";
            dataObject.message = `There is an error occurred. ${error.message}`;
            res.json(dataObject);
          });
      } else {
        dataObject.status = "error";
        dataObject.message = `There is no file folder exists with fileFolderID ${fileFolderID}. Please provide a valid fileFolderID.`;
        dataObject.data = {};
        res.json(dataObject);
      }
    })
    .catch((err) => {
      dataObject.status = "error";
      dataObject.message = `There is an error occurred. ${err}`;
      dataObject.data = {};
      res.json(dataObject);
    });
};
