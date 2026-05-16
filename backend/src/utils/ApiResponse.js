// this is a custom response class that we are using to send responses in our controllers and middlewares
// this makes it easier to send responses in a consistent way and also to send custom messages and status codes
// without having to write the same code again and again in every controller and middleware

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
