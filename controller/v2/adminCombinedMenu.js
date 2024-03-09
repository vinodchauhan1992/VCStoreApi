const AdminMenuUtility = require("../../utilities/adminMenuUtility");
const AdminSubmenuUtility = require("../../utilities/adminSubmenuUtility");

module.exports.getAllAdminCombinedMenus = async (req, res) => {
  try {
    const { data: menusData } = await AdminMenuUtility.getAllAdminMenusUtil({
      req,
    });
    const { data: submenusData } =
      await AdminSubmenuUtility.getAllAdminSubmenusUtil({
        req,
      });

    let combinedMenuDataArray = [];

    for (let indexI = 0; indexI < menusData.length; indexI++) {
      const element = menusData[indexI];
      const submenuElements = [];
      for (let indexJ = 0; indexJ < submenusData.length; indexJ++) {
        const subElement = submenusData[indexJ];
        if (element.id.toString() === subElement.adminMenuID.toString()) {
          submenuElements.push(subElement);
        }
      }
      const objectToPush = { menuData: element, submenus: submenuElements };
      combinedMenuDataArray.push(objectToPush);
    }

    res.json({
      status: "success",
      message: "Combined admin menus data fetched successfully.",
      data: combinedMenuDataArray,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getAdminCombinedMenuByID = async (req, res) => {
  if (!req?.params?.adminMenuID || req.params.adminMenuID === "") {
    res.json({
      status: "error",
      message: "Admin menu id is required.",
      data: {},
    });
  }
  const adminMenuID = req.params.adminMenuID;

  try {
    const {
      data: menuData,
      isAdminMenuExists,
      isSucceeded,
    } = await AdminMenuUtility.getAdminMenuDataByIdInDbUtil({
      adminMenuID: adminMenuID,
    });

    if (
      isAdminMenuExists &&
      isSucceeded &&
      menuData &&
      Object.keys(menuData).length > 0
    ) {
      const { data: submenusData } =
        await AdminSubmenuUtility.getAllAdminSubmenusUtil({
          req,
        });
      let combinedMenuDataArray = [];

      const submenuElements = [];
      for (let indexI = 0; indexI < submenusData.length; indexI++) {
        const subElement = submenusData[indexI];
        if (adminMenuID === subElement.adminMenuID.toString()) {
          submenuElements.push(subElement);
        }
      }

      const objectToPush = { menuData: menuData, submenus: submenuElements };
      combinedMenuDataArray.push(objectToPush);

      res.json({
        status: "success",
        message: `Combined admin menu data by id ${adminMenuID} fetched successfully.`,
        data: combinedMenuDataArray,
      });
    } else {
      res.json({
        status: "error",
        message: `Combined admin menu data by id ${adminMenuID} doesn't exists.`,
        data: combinedMenuDataArray,
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};
