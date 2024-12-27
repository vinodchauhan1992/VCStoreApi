const ContactUsUtility = require("../../utilities/v3/contactUsUtility");

module.exports.getAllContactUsData = async (req, res) => {
  const foundContactUsDataObject = await ContactUsUtility.getAllContactUsDataUtil({
    req,
  });
  res.json(foundContactUsDataObject);
};

module.exports.getContactUsDataByID = async (req, res) => {
  const foundContactUsDataObject = await ContactUsUtility.getContactUsDataByIDUtil({
    req,
  });
  res.json(foundContactUsDataObject);
};

module.exports.addNewContactUsData = async (req, res) => {
  const foundContactUsDataObject = await ContactUsUtility.addNewContactUsDataUtil({
    req,
  });
  res.json(foundContactUsDataObject);
};

module.exports.deleteContactUsData = async (req, res) => {
  const foundContactUsDataObject = await ContactUsUtility.deleteContactUsDataUtil({
    req,
  });
  res.json(foundContactUsDataObject);
};
