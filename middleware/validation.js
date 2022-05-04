const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");

const checkString = (strVal, varName) => {
  if (!strVal)
    throw new AppError(
      `Error: You must supply a ${varName}`,
      ErrorType.validation_error
    );
  if (typeof strVal !== "string")
    throw new AppError(
      `Error: ${varName} must be string`,
      ErrorType.validation_error
    );
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw new AppError(
      `Error: ${varName} can't be emplty string or string with just spaces`,
      ErrorType.validation_error
    );
  if (!isNaN(strVal))
    throw new AppError(
      `Error: ${strVal} is not a valid value for ${varName} as it only conatins digits`,
      ErrorType.validation_error
    );
  return strVal;
};

const checkEmail = (mail) => {
  const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regEx.test(mail)) {
    throw new AppError(
      `Error: mail id is not valid`,
      ErrorType.validation_error
    );
  }
  return mail;
};

module.exports = { checkString, checkEmail, checkMobileNo };
