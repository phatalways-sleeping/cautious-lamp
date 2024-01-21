export default class ErrorLogger {
  constructor(formattedError, error, { debugMode }) {
    this.formattedError = formattedError;
    this.error = error;
    this.debugMode = debugMode;
  }

  format() {
    const message = this.map();

    if (this.debugMode) {
      return {
        ...this.formattedError,
        ...this.error,
      };
    }

    return message;
  }

  map() {
    const { message } = this.formattedError;

    const { extensions } = this.formattedError;

    if (this.debugMode && !extensions.response) {
      // Internal GraphQL errors
      return this.formattedError;
    }

    const { code } = extensions;

    const payload = {
      code,
      message,
    };

    if (extensions.response && extensions.response.body) {
      const { status, error } = extensions.response.body;
      payload.message = extensions.response.body.message;
      payload.status = status;
      if (this.debugMode) payload.error = error;
    }

    return payload;
  }
}
