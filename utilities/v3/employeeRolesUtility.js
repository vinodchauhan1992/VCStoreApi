const EmployeeRolesSchema = require("../../model/v3/employeeRoles");
const DepartmentsSchema = require("../../model/v3/departments");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getDepartmentDetailsByDepartmentId = async ({
  departmentID,
}) => {
  const foundDepartmentObject =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: DepartmentsSchema,
      schemaName: "Department",
      dataID: departmentID,
    });
  if (
    foundDepartmentObject.status === "success" &&
    Object.keys(foundDepartmentObject?.data).length > 0
  ) {
    return foundDepartmentObject;
  }
  return {
    status: foundDepartmentObject?.status,
    message: foundDepartmentObject?.message,
    data: {
      departmentID: departmentID,
    },
  };
};

module.exports.getSingleEmployeeRoleWithAllDetails = async ({
  employeeRoleData,
}) => {
  const departmentDetailsObject = await this.getDepartmentDetailsByDepartmentId(
    {
      departmentID: employeeRoleData?.departmentID,
    }
  );
  return {
    id: employeeRoleData?.id,
    title: employeeRoleData?.title,
    departmentDetails: departmentDetailsObject?.data,
    dateAdded: employeeRoleData?.dateAdded,
    dateModified: employeeRoleData?.dateModified,
  };
};

module.exports.getAllEmployeeRolesWithAllDetails = async ({
  allEmployeeRoles,
}) => {
  return Promise.all(
    allEmployeeRoles?.map(async (employeeRoleData) => {
      const employeeRoleDetails =
        await this.getSingleEmployeeRoleWithAllDetails({
          employeeRoleData,
        });
      return employeeRoleDetails;
    })
  );
};

module.exports.getAllEmployeeRolesUtil = async ({ req }) => {
  const resultDataObject = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: EmployeeRolesSchema,
    schemaName: "Employee Roles",
  });

  if (resultDataObject?.status === "error") {
    return resultDataObject;
  }

  const fullDetailsData = await this.getAllEmployeeRolesWithAllDetails({
    allEmployeeRoles: resultDataObject?.data,
  });
  return {
    ...resultDataObject,
    data: fullDetailsData,
  };
};

module.exports.getEmployeeRoleByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Employee Role id is required.",
      data: {},
    };
  }

  const employeeRoleID = req.body.id;

  const resultDataObject = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: EmployeeRolesSchema,
    schemaName: "Employee Role",
    dataID: employeeRoleID,
  });

  if (resultDataObject?.status === "error") {
    return resultDataObject;
  }

  const fullDetailsData = await this.getSingleEmployeeRoleWithAllDetails({
    employeeRoleData: resultDataObject?.data,
  });
  return {
    ...resultDataObject,
    data: fullDetailsData,
  };
};

module.exports.getEmployeeRoleByDepartmentIDUtil = async ({ req }) => {
  if (!req?.body?.departmentID || req.body.departmentID === "") {
    return {
      status: "error",
      message: "Department id is required.",
      data: [],
    };
  }

  const departmentID = req.body.departmentID;

  const resultDataObject =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: EmployeeRolesSchema,
      schemaName: "Employee roles",
      dataID: departmentID,
      keyname: "departmentID",
    });

  if (resultDataObject?.status === "error") {
    return resultDataObject;
  }

  const fullDetailsData = await this.getAllEmployeeRolesWithAllDetails({
    allEmployeeRoles: resultDataObject?.data ?? [],
  });
  return {
    ...resultDataObject,
    data: fullDetailsData,
  };
};

module.exports.addNewEmployeeRoleUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Employee role title is required.",
      data: {},
    };
  }
  if (!req?.body?.departmentID || req.body.departmentID === "") {
    return {
      status: "error",
      message: "Department id is required.",
      data: {},
    };
  }

  const employeeRoleID = CommonUtility.getUniqueID();
  const departmentID = req.body.departmentID;
  const employeeRoleTitle = req.body.title;
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundEmployeeRoleByTitleObject =
    await CommonApisUtility.getDataByTitleFromSchemaUtil({
      schema: EmployeeRolesSchema,
      schemaName: "Employee Role",
      dataTitle: employeeRoleTitle,
    });
  if (foundEmployeeRoleByTitleObject?.status === "success") {
    return {
      status: "error",
      message: `Employee role with title "${employeeRoleTitle}" already exists.`,
      data: {},
    };
  }

  const newEmployeeRoleSchema = EmployeeRolesSchema({
    id: employeeRoleID,
    title: employeeRoleTitle,
    departmentID: departmentID,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  const resultDataObject = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newEmployeeRoleSchema,
    schemaName: "Employee Role",
  });

  if (resultDataObject?.status === "error") {
    return resultDataObject;
  }

  const fullDetailsData = await this.getSingleEmployeeRoleWithAllDetails({
    employeeRoleData: resultDataObject?.data,
  });
  return {
    ...resultDataObject,
    data: fullDetailsData,
  };
};

module.exports.updateEmployeeRoleUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Employee role id is required.",
      data: {},
    };
  }
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Employee role title is required.",
      data: {},
    };
  }
  if (!req?.body?.departmentID || req.body.departmentID === "") {
    return {
      status: "error",
      message: "Department id is required.",
      data: {},
    };
  }

  const employeeRoleID = req.body.id;
  const departmentID = req.body.departmentID;
  const employeeRoleTitle = req.body.title;
  const dateModified = new Date();

  const foundEmployeeRoleIdObject = await this.getEmployeeRoleByIDUtil({ req });
  if (foundEmployeeRoleIdObject?.status === "error") {
    return foundEmployeeRoleIdObject;
  }

  const foundEmployeeRoleTitleObject =
    await CommonApisUtility.getDataByTitleFromSchemaUtil({
      schema: EmployeeRolesSchema,
      schemaName: "Employee Role",
      dataTitle: employeeRoleTitle,
    });
  if (
    foundEmployeeRoleTitleObject?.status === "success" &&
    foundEmployeeRoleTitleObject?.data?.id !== employeeRoleID
  ) {
    return {
      status: "error",
      message: `Another employee role with same title "${employeeRoleTitle}" already exists. Please add a different employee role`,
      data: {},
    };
  }

  const newEmployeeRole = {
    id: employeeRoleID,
    title: employeeRoleTitle,
    departmentID: departmentID,
    dateModified: dateModified,
  };

  const updatedEmployeeRoleSet = {
    $set: newEmployeeRole,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: EmployeeRolesSchema,
    newDataObject: newEmployeeRole,
    updatedDataSet: updatedEmployeeRoleSet,
    schemaName: "Employee Role",
    dataID: employeeRoleID,
  });
};

module.exports.deleteEmployeeRoleUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Employee role id is required.",
      data: {},
    };
  }

  const employeeRoleID = req.body.id;

  const foundEmployeeRoleIdObject = await this.getEmployeeRoleByIDUtil({ req });
  if (foundEmployeeRoleIdObject?.status === "error") {
    return foundEmployeeRoleIdObject;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: EmployeeRolesSchema,
    schemaName: "Employee Role",
    dataID: employeeRoleID,
  });
};
