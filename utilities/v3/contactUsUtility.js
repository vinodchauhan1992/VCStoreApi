const ContactUsSchema = require("../../model/v3/contactUs");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllContactUsDataUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: ContactUsSchema,
    schemaName: "ContactUs data",
  });
};

module.exports.getContactUsDataByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Contact us id is required.`,
      data: {},
    };
  }

  const contactUsID = req.body.id;

  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: ContactUsSchema,
    schemaName: "ContactUs data",
    dataID: contactUsID,
  });
};

module.exports.addNewContactUsDataUtil = async ({ req }) => {
  if (!req?.body?.name || req.body.name === "") {
    return {
      status: "error",
      message: `Name is required.`,
      data: {},
    };
  }
  if (!req?.body?.email || req.body.email === "") {
    return {
      status: "error",
      message: `Email address is required.`,
      data: {},
    };
  }
  if (!CommonUtility.isValidEmail({ email: req.body.email })) {
    return {
      status: "error",
      message: `Email address is invalid.`,
      data: {},
    };
  }
  if (!req?.body?.subject || req.body.subject === "") {
    return {
      status: "error",
      message: `Subject is required.`,
      data: {},
    };
  }
  if (!req?.body?.message || req.body.message === "") {
    return {
      status: "error",
      message: `Message is required.`,
      data: {},
    };
  }

  const contactUsID = CommonUtility.getUniqueID();
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  const dateAdded = new Date();
  const dateModified = new Date();

  const newContactUsSchema = ContactUsSchema({
    id: contactUsID,
    name: name,
    email: email,
    subject: subject,
    message: message,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newContactUsSchema,
    schemaName: "ContactUs data",
  });
};

module.exports.deleteContactUsDataUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "ContactUs id is required.",
      data: {},
    };
  }

  const contactUsID = req.body.id;

  const foundContactUsDataByIDObject = await this.getContactUsDataByIDUtil({
    req,
  });
  if (foundContactUsDataByIDObject?.status === "error") {
    return foundContactUsDataByIDObject;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: ContactUsSchema,
    schemaName: "ContactUs data",
    dataID: contactUsID,
  });
};
