const { ErrorType } = require("./enum");
const AppError = require("./appError");

function generateErrorResponse(err, status, res) {
  let errObj = { status: status, message: err.message };
  errObj.error = status === 500 ? err.optionalInfo || {} : {};
  if (process.env.NODE_ENV === "development") errObj.originalError = err;
  return res.status(status).send(errObj);
}

function generateAndSendAppErrorResponce(err, res) {
  switch (err.reason) {
    case ErrorType.invalid_request:
      return generateErrorResponse(err, 400, res);
    case ErrorType.not_found:
      return generateErrorResponse(err, 404, res);
    case ErrorType.permission_denied:
      return generateErrorResponse(err, 403, res);
    case ErrorType.unauthorized:
      return generateErrorResponse(err, 401, res);
    case ErrorType.validation_error:
      return generateErrorResponse(err, 400, res);
    case ErrorType.unknown_error:
    default:
      // logger.error(err.stack);
      return generateErrorResponse(err, 500, res);
  }
}

module.exports = function (err, req, res, next) {
  return generateAndSendAppErrorResponce(err, res);
};
//const { ErrorType } = require("./enum");
//const AppError = require("./appError");

function generateErrorResponse(err, status, res) {
  let errObj = { status: status, message: err.message };
  errObj.error = status === 500 ? err.optionalInfo || {} : {};
  if (process.env.NODE_ENV === "development") errObj.originalError = err;
  return res.status(status).send(errObj);
}

function generateAndSendAppErrorResponce(err, res) {
  switch (err.reason) {
    case ErrorType.invalid_request:
      return generateErrorResponse(err, 400, res);
    case ErrorType.not_found:
      return generateErrorResponse(err, 404, res);
    case ErrorType.permission_denied:
      return generateErrorResponse(err, 403, res);
    case ErrorType.unauthorized:
      return generateErrorResponse(err, 401, res);
    case ErrorType.validation_error:
      return generateErrorResponse(err, 400, res);
    case ErrorType.unknown_error:
    default:
      // logger.error(err.stack);
      return generateErrorResponse(err, 500, res);
  }
}

module.exports = function (err, req, res, next) {
  return generateAndSendAppErrorResponce(err, res);
};
