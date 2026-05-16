// this is a custom error class that we are using to throw errors in our controllers and middlewares
// this makes it easier to handle errors in a consistent way and also to send custom error messages and status codes
// without having to write the same code again and again in every controller and middleware

class ApiError extends Error {
  constructor(
    statusCode,
    message = "No message: Something went wrong",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
