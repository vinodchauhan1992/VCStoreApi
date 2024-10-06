const DepartmentsSchema = require("../../model/v3/departments");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllDepartmentsUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: DepartmentsSchema,
    schemaName: "Departments",
  });
};

module.exports.getDepartmentByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Department id is required.",
      data: {},
    };
  }

  const departmentID = req.body.id;

  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: DepartmentsSchema,
    schemaName: "Department",
    dataID: departmentID,
  });
};

module.exports.getDepartmentByCodeUtil = async ({ req }) => {
  if (!req?.body?.code || req.body.code === "") {
    return {
      status: "error",
      message: "Department code is required.",
      data: {},
    };
  }

  const departmentCode = req.body.code;

  return await CommonApisUtility.getDataByCodeFromSchemaUtil({
    schema: DepartmentsSchema,
    schemaName: "Department",
    dataCode: departmentCode,
  });
};

module.exports.addNewDepartmentUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Department title is required.",
      data: {},
    };
  }

  const departmentID = CommonUtility.getUniqueID();
  const departmentTitle = req.body.title;
  const departmentCode = CommonUtility.getCodeFromTitle({
    title: departmentTitle,
  });
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundDepartmentByTitleObject =
    await CommonApisUtility.getDataByTitleFromSchemaUtil({
      schema: DepartmentsSchema,
      schemaName: "Department",
      dataTitle: departmentTitle,
    });
  if (foundDepartmentByTitleObject?.status === "success") {
    return {
      status: "error",
      message: `Department with title "${departmentTitle}" already exists.`,
      data: {},
    };
  }

  const newDepartmentSchema = DepartmentsSchema({
    id: departmentID,
    title: departmentTitle,
    code: departmentCode,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newDepartmentSchema,
    schemaName: "Department",
  });
};

module.exports.updateDepartmentUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Department id is required.",
      data: {},
    };
  }
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Department title is required.",
      data: {},
    };
  }

  const departmentID = req.body.id;
  const departmentTitle = req.body.title;
  const departmentCode = CommonUtility.getCodeFromTitle({
    title: departmentTitle,
  });
  const dateModified = new Date();

  const foundDepartmentIdObject = await this.getDepartmentByIDUtil({ req });
  if (foundDepartmentIdObject?.status === "error") {
    return foundDepartmentIdObject;
  }

  const foundDepartmentTitleObject =
    await CommonApisUtility.getDataByTitleFromSchemaUtil({
      schema: DepartmentsSchema,
      schemaName: "Department",
      dataTitle: departmentTitle,
    });
  if (
    foundDepartmentTitleObject?.status === "success" &&
    foundDepartmentTitleObject?.data?.id !== departmentID
  ) {
    return {
      status: "error",
      message: `Another department with same title "${departmentTitle}" already exists. Please add a different department`,
      data: {},
    };
  }

  const newDepartment = {
    id: departmentID,
    title: departmentTitle,
    code: departmentCode,
    dateModified: dateModified,
  };

  const updatedDepartmentSet = {
    $set: newDepartment,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: DepartmentsSchema,
    newDataObject: newDepartment,
    updatedDataSet: updatedDepartmentSet,
    schemaName: "Department",
    dataID: departmentID,
  });
};

module.exports.deleteDepartmentUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Department id is required.",
      data: {},
    };
  }

  const departmentID = req.body.id;

  const foundDepartmentIdObject = await this.getDepartmentByIDUtil({ req });
  if (foundDepartmentIdObject?.status === "error") {
    return foundDepartmentIdObject;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: DepartmentsSchema,
    schemaName: "Department",
    dataID: departmentID,
  });
};
