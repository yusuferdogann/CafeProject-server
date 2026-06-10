import { AppError } from "./errorHandler.js";

export function validateBody(schema) {
  return (req, _res, next) => {
    try {
      const result = schema(req.body || {});
      if (result?.error) {
        throw new AppError(result.error, 400, "VALIDATION_ERROR");
      }
      req.body = result?.value ?? req.body;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateParams(schema) {
  return (req, _res, next) => {
    try {
      const result = schema(req.params || {});
      if (result?.error) {
        throw new AppError(result.error, 400, "VALIDATION_ERROR");
      }
      req.params = result?.value ?? req.params;
      next();
    } catch (error) {
      next(error);
    }
  };
}
