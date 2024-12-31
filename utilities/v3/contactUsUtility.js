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

module.exports.getContactUsPageCallingDataUtil = async ({ req }) => {
  return [
    {
      kind: "call",
      code: "+88",
      phone: "01611112222",
    },
  ];
};

module.exports.getContactUsPageEmailingDataUtil = async ({ req }) => {
  return [
    {
      type: "customer care",
      kind: "email",
      email: "customer@exclusive.com",
    },
    {
      type: "support",
      kind: "email",
      email: "support@exclusive.com",
    },
  ];
};

module.exports.getContactUsPageDataUtil = async ({ req }) => {
  const callingData = await this.getContactUsPageCallingDataUtil({ req });
  const emailingData = await this.getContactUsPageEmailingDataUtil({ req });
  return {
    status: "success",
    message: `Contact us page data fetched successfully.`,
    data: {
      id: "contact_us_page_data_1",
      freeTexts: {
        calling: {
          icon: "phone",
          heading: "Call To Us",
          subheading: "We are available 24/7, 7 days a week.",
        },
        emailing: {
          icon: "envelope",
          heading: "Write To US",
          subheading:
            "Fill out our form and we will contact you within 24 hours.",
        },
      },
      callingData: callingData,
      emailingData: emailingData,
    },
  };
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
  if (!req?.body?.phone || req.body.phone === "") {
    return {
      status: "error",
      message: `Phone is required.`,
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
  const phone = req.body.phone;
  const subject = req.body.subject;
  const message = req.body.message;
  const dateAdded = new Date();
  const dateModified = new Date();

  const newContactUsSchema = ContactUsSchema({
    id: contactUsID,
    name: name,
    email: email,
    phone: phone,
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
