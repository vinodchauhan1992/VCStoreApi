const EmployeeSalariesSchema = require("../../model/v3/employeeSalaries");
const EmployeesSchema = require("../../model/v3/employees");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const EmployeesUtility = require("./employeesUtility");

module.exports.getDataToAddAndUpdate = ({ req }) => {
  const employeeID = req.body.employeeID;
  const isNewTaxRegime = req?.body?.isNewTaxRegime ?? false;

  const monthlyHra = Number(req.body.monthlyHra);
  const monthlyDa = Number(req.body.monthlyDa);
  const monthlyCa = Number(req.body.monthlyCa);
  const monthlyBasicSalary = Number(req.body.monthlyBasicSalary);
  const monthlyPfDeduction = Number(req.body.monthlyPfDeduction);
  const annualHra = monthlyHra * 12;
  const annualDa = monthlyDa * 12;
  const annualCa = monthlyCa * 12;
  const annualBasicSalary = monthlyBasicSalary * 12;
  const annualPfDeduction = monthlyPfDeduction * 12;
  const monthlyCtc = monthlyHra + monthlyDa + monthlyCa + monthlyBasicSalary;
  const annualCtc = annualHra + annualDa + annualCa + annualBasicSalary;
  const annualTaxDeduction = isNewTaxRegime
    ? CommonUtility.getTaxByNewTaxRegime({ annualCtc: annualCtc })
    : CommonUtility.getTaxByOldTaxRegime({ annualCtc: annualCtc });
  const monthlyTaxDeduction = annualTaxDeduction / 12;
  const monthlySalaryInHand =
    monthlyCtc - monthlyPfDeduction - monthlyTaxDeduction;
  const annualSalaryInHand = annualCtc - annualPfDeduction - annualTaxDeduction;

  return {
    id: CommonUtility.getUniqueID(),
    employeeID: employeeID,
    monthlyHra: CommonUtility.amountRoundingFunc({ value: monthlyHra }),
    monthlyDa: CommonUtility.amountRoundingFunc({ value: monthlyDa }),
    monthlyCa: CommonUtility.amountRoundingFunc({ value: monthlyCa }),
    monthlyBasicSalary: CommonUtility.amountRoundingFunc({
      value: monthlyBasicSalary,
    }),
    monthlyPfDeduction: CommonUtility.amountRoundingFunc({
      value: monthlyPfDeduction,
    }),
    monthlyCtc: CommonUtility.amountRoundingFunc({ value: monthlyCtc }),
    annualHra: CommonUtility.amountRoundingFunc({ value: annualHra }),
    annualDa: CommonUtility.amountRoundingFunc({ value: annualDa }),
    annualCa: CommonUtility.amountRoundingFunc({ value: annualCa }),
    annualBasicSalary: CommonUtility.amountRoundingFunc({
      value: annualBasicSalary,
    }),
    annualPfDeduction: CommonUtility.amountRoundingFunc({
      value: annualPfDeduction,
    }),
    monthlyCtc: CommonUtility.amountRoundingFunc({ value: monthlyCtc }),
    annualCtc: CommonUtility.amountRoundingFunc({ value: annualCtc }),
    monthlyTaxDeduction: CommonUtility.amountRoundingFunc({
      value: monthlyTaxDeduction,
    }),
    annualTaxDeduction: CommonUtility.amountRoundingFunc({
      value: annualTaxDeduction,
    }),
    monthlySalaryInHand: CommonUtility.amountRoundingFunc({
      value: monthlySalaryInHand,
    }),
    annualSalaryInHand: CommonUtility.amountRoundingFunc({
      value: annualSalaryInHand,
    }),
    isNewTaxRegime: isNewTaxRegime,
    dateAdded: new Date(),
    dateModified: new Date(),
  };
};

module.exports.getSingleEmployeeSalaryWithAllEmployeeDataUtil = async ({
  employeeSalaryData,
}) => {
  const employeeID = employeeSalaryData.employeeID;
  const req = { body: { id: employeeID } };
  const foundEmployeeDataByIDObj = await EmployeesUtility.getEmployeeByIDUtil({
    req,
  });
  let finalObj = {
    ...employeeSalaryData,
    employeeData: {},
  };
  if (foundEmployeeDataByIDObj?.status === "success") {
    finalObj = {
      ...finalObj,
      employeeData: foundEmployeeDataByIDObj?.data ?? {},
    };
  }
  return finalObj;
};

module.exports.getAllEmployeeSalariesWithAllEmployeesUtil = async ({
  allEmployeeSalariesArray,
}) => {
  return Promise.all(
    allEmployeeSalariesArray?.map(async (employeeSalaryData) => {
      const employeeSalaryDetails =
        await this.getSingleEmployeeSalaryWithAllEmployeeDataUtil({
          employeeSalaryData: employeeSalaryData,
        });
      return employeeSalaryDetails;
    })
  );
};

module.exports.getAllEmpSalariesUtil = async ({ req }) => {
  const foundSalaryObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: EmployeeSalariesSchema,
    schemaName: "Employee Salaries",
  });

  if (foundSalaryObj?.status === "error") {
    return foundSalaryObj;
  }

  const dataArr = foundSalaryObj?.data ?? [];

  const fullEmpDetailsArr =
    await this.getAllEmployeeSalariesWithAllEmployeesUtil({
      allEmployeeSalariesArray: dataArr,
    });

  return {
    ...foundSalaryObj,
    data: fullEmpDetailsArr,
  };
};

module.exports.getEmpSalaryByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Salary id is required.`,
      data: {},
    };
  }
  const employeeSalaryObject =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: EmployeeSalariesSchema,
      schemaName: "Employee Salary",
      dataID: req.body.id,
    });
  if (employeeSalaryObject?.status === "error") {
    return employeeSalaryObject;
  }

  const fullEmpDetailsObj =
    await this.getSingleEmployeeSalaryWithAllEmployeeDataUtil({
      employeeSalaryData: employeeSalaryObject?.data,
    });

  return {
    ...employeeSalaryObject,
    data: fullEmpDetailsObj,
  };
};

module.exports.getEmpSalaryByEmpIDUtil = async ({ req }) => {
  if (!req?.body?.employeeID || req.body.employeeID === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  const employeeID = req.body.employeeID;
  const employeeSalaryObject =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: EmployeeSalariesSchema,
      schemaName: "Employee Salary",
      dataID: employeeID,
      keyname: "employeeID",
    });
  if (employeeSalaryObject?.status === "error") {
    return {
      ...employeeSalaryObject,
      message: `Employee salary details not found with employee id ${employeeID}`,
    };
  }

  const fullEmpDetailsObj =
    await this.getSingleEmployeeSalaryWithAllEmployeeDataUtil({
      employeeSalaryData: employeeSalaryObject?.data,
    });

  return {
    ...employeeSalaryObject,
    message: `Employee salary details found with employee id ${employeeID}`,
    data: fullEmpDetailsObj,
  };
};

module.exports.getEmpSalaryByEmpCodeUtil = async ({ req }) => {
  if (!req?.body?.employeeCode || req.body.employeeCode === "") {
    return {
      status: "error",
      message: `Employee code is required.`,
      data: {},
    };
  }
  const employeeCode = req.body.employeeCode;

  const foundAllEmpSalariesObj = await this.getAllEmpSalariesUtil({ req: req });
  if (foundAllEmpSalariesObj?.status === "error") {
    return {
      status: "error",
      message: `No salary details found with employee code ${employeeCode}`,
      data: {},
    };
  }

  const foundEmpSalaryByEmpCode = foundAllEmpSalariesObj?.data?.find(
    (empSalaryData) =>
      empSalaryData?.employeeData?.employeeCode === employeeCode
  );
  if (foundEmpSalaryByEmpCode) {
    return {
      status: "success",
      message: `Salary details found with employee code ${employeeCode}`,
      data: foundEmpSalaryByEmpCode,
    };
  }
  return {
    status: "error",
    message: `No salary details found with employee code ${employeeCode}`,
    data: {},
  };
};

module.exports.addNewEmpSalaryUtil = async ({ req }) => {
  if (!req?.body?.employeeID || req.body.employeeID === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyHra || req.body.monthlyHra === "") {
    return {
      status: "error",
      message: `Monthly hra(house rent allowance) is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyHra)) {
    return {
      status: "error",
      message: `Monthly hra(house rent allowance) must be a number value.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyDa || req.body.monthlyDa === "") {
    return {
      status: "error",
      message: `Monthly da(dress allowance) is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyDa)) {
    return {
      status: "error",
      message: `Monthly da(dress allowance) must be a number value.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyCa || req.body.monthlyCa === "") {
    return {
      status: "error",
      message: `Monthly ca(conveyance allowance) is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyCa)) {
    return {
      status: "error",
      message: `Monthly ca(conveyance allowance) must be a number value.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyBasicSalary || req.body.monthlyBasicSalary === "") {
    return {
      status: "error",
      message: `Monthly basic salary is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyBasicSalary)) {
    return {
      status: "error",
      message: `Monthly basic salary must be a number value.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyPfDeduction || req.body.monthlyPfDeduction === "") {
    return {
      status: "error",
      message: `Monthly pf deduction is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyPfDeduction)) {
    return {
      status: "error",
      message: `Monthly pf deduction must be number value.`,
      data: {},
    };
  }

  const employeeID = req.body.employeeID;

  const foundEmpObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: EmployeesSchema,
    schemaName: "Employee",
    dataID: employeeID,
  });

  if (foundEmpObj?.status === "error") {
    return foundEmpObj;
  }

  const foundEmpSalaryObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: EmployeeSalariesSchema,
    schemaName: "Employee Salary",
    dataID: employeeID,
    keyname: "employeeID",
  });

  if (foundEmpSalaryObj?.status === "success") {
    return {
      status: "error",
      message: `Salary for employee id ${employeeID} is already exists.`,
      data: {},
    };
  }

  const dataToAdd = this.getDataToAddAndUpdate({ req: req });

  const newEmpSalary = EmployeeSalariesSchema({
    id: dataToAdd.id,
    employeeID: dataToAdd.employeeID,
    monthlyHra: dataToAdd.monthlyHra,
    monthlyDa: dataToAdd.monthlyDa,
    monthlyCa: dataToAdd.monthlyCa,
    monthlyBasicSalary: dataToAdd.monthlyBasicSalary,
    monthlyPfDeduction: dataToAdd.monthlyPfDeduction,
    annualHra: dataToAdd.annualHra,
    annualDa: dataToAdd.annualDa,
    annualCa: dataToAdd.annualCa,
    annualBasicSalary: dataToAdd.annualBasicSalary,
    annualPfDeduction: dataToAdd.annualPfDeduction,
    monthlyCtc: dataToAdd.monthlyCtc,
    annualCtc: dataToAdd.annualCtc,
    monthlyTaxDeduction: dataToAdd.monthlyTaxDeduction,
    annualTaxDeduction: dataToAdd.annualTaxDeduction,
    monthlySalaryInHand: dataToAdd.monthlySalaryInHand,
    annualSalaryInHand: dataToAdd.annualSalaryInHand,
    isNewTaxRegime: dataToAdd.isNewTaxRegime,
    dateAdded: dataToAdd.dateAdded,
    dateModified: dataToAdd.dateModified,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newEmpSalary,
    schemaName: "Employee Salary",
  });
};

module.exports.updateEmpSalaryUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Salary id is required.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyHra || req.body.monthlyHra === "") {
    return {
      status: "error",
      message: `Monthly hra(house rent allowance) is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyHra)) {
    return {
      status: "error",
      message: `Monthly hra(house rent allowance) must be a number value.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyDa || req.body.monthlyDa === "") {
    return {
      status: "error",
      message: `Monthly da(dress allowance) is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyDa)) {
    return {
      status: "error",
      message: `Monthly da(dress allowance) must be a number value.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyCa || req.body.monthlyCa === "") {
    return {
      status: "error",
      message: `Monthly ca(conveyance allowance) is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyCa)) {
    return {
      status: "error",
      message: `Monthly ca(conveyance allowance) must be a number value.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyBasicSalary || req.body.monthlyBasicSalary === "") {
    return {
      status: "error",
      message: `Monthly basic salary is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyBasicSalary)) {
    return {
      status: "error",
      message: `Monthly basic salary must be a number value.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyPfDeduction || req.body.monthlyPfDeduction === "") {
    return {
      status: "error",
      message: `Monthly pf deduction is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyPfDeduction)) {
    return {
      status: "error",
      message: `Monthly pf deduction must be number value.`,
      data: {},
    };
  }

  const salaryID = req.body.id;

  const foundSalaryObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: EmployeeSalariesSchema,
    schemaName: "Employee Salary",
    dataID: salaryID,
  });

  if (foundSalaryObj?.status === "error") {
    return foundSalaryObj;
  }

  const dataToUpdate = this.getDataToAddAndUpdate({ req: req });

  const newEmpSalary = {
    id: salaryID,
    monthlyHra: dataToUpdate.monthlyHra,
    monthlyDa: dataToUpdate.monthlyDa,
    monthlyCa: dataToUpdate.monthlyCa,
    monthlyBasicSalary: dataToUpdate.monthlyBasicSalary,
    monthlyPfDeduction: dataToUpdate.monthlyPfDeduction,
    annualHra: dataToUpdate.annualHra,
    annualDa: dataToUpdate.annualDa,
    annualCa: dataToUpdate.annualCa,
    annualBasicSalary: dataToUpdate.annualBasicSalary,
    annualPfDeduction: dataToUpdate.annualPfDeduction,
    monthlyCtc: dataToUpdate.monthlyCtc,
    annualCtc: dataToUpdate.annualCtc,
    monthlyTaxDeduction: dataToUpdate.monthlyTaxDeduction,
    annualTaxDeduction: dataToUpdate.annualTaxDeduction,
    monthlySalaryInHand: dataToUpdate.monthlySalaryInHand,
    annualSalaryInHand: dataToUpdate.annualSalaryInHand,
    isNewTaxRegime: dataToUpdate.isNewTaxRegime,
    dateModified: dataToUpdate.dateModified,
  };

  const updatedEmpSalarySet = {
    $set: newEmpSalary,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: EmployeeSalariesSchema,
    newDataObject: newEmpSalary,
    updatedDataSet: updatedEmpSalarySet,
    schemaName: "Employee Salary",
    dataID: salaryID,
  });
};

module.exports.deleteEmpSalaryUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Employee salary id is required.",
      data: {},
    };
  }

  const employeeSalaryID = req.body.id;

  const foundEmpSalaryObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: EmployeeSalariesSchema,
    schemaName: "Employee Salary",
    dataID: employeeSalaryID,
  });

  if (foundEmpSalaryObj?.status === "error") {
    return foundEmpSalaryObj;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: EmployeeSalariesSchema,
    schemaName: "Employee Salary",
    dataID: employeeSalaryID,
  });
};
