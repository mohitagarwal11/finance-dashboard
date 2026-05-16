// asyncHandler is a higher order function which takes a request handler function and returns a new function that wraps the request handler in a promise
// this is useful to catch any errors that might occur in the request handler and pass them to the next middleware which is the error handler
// without this we would have to write try-catch/promise in every request handler to catch errors and pass them to the error handler which is repetitive

// asyncHandler using promise
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// asyncHandler using try-catch
// const asyncHandler = (requestHandler) => async (req, res, next) => {
//   try {
//     await requestHandler(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export { asyncHandler };
