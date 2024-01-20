import { ApolloServerErrorCode } from "@apollo/server/errors";

const ErrorLogger = (function () {
  function ErrorLogger(formattedError, error, { debugMode }) {
    this.formattedError = formattedError;
    this.error = error;
    this.debugMode = debugMode;
  }

  ErrorLogger.prototype.format = function () {
    const message = map.call(this);

    if (this.debugMode) return {
      ...this.formattedError,
      ...this.error
    };

    return message;
  };

  function map() {
    const { code, response } = this.formattedError.extensions;

    const { status, message, error } = response.body;

    const payload = {
      status,
      code,
      message,
    };

    if (this.debugMode) payload.error = error;

    return payload;
  }

  return ErrorLogger;
})();

export default ErrorLogger;
