class AppError extends Error {
  constructor(message, reason, optionalInfo) {
    super(message);
    this.reason = reason;
    this.optionalInfo = optionalInfo || [{ message: message }];
  }
}

module.exports = AppError;
