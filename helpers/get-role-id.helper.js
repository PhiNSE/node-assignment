const getRoleId = (roleName) => {
  const userRolesModel = require("../models/user-roles");
  return userRolesModel.findOne({
    roleName: roleName,
  });
};

module.exports = { getRoleId };
