const validate =
  (schema) =>
  async (req, res, next) => {
    try {
      req.body = await schema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      next();
    } catch (error) {
      const errors = {};
      if (error.details) {
        for (const detail of error.details) {
          const key = detail.path.join(".");
          if (!errors[key]) {
            errors[key] = detail.message;
          }
        }
      }

      const err = new Error("Validation failed");
      err.statusCode = 400;
      err.errors = Object.keys(errors).length > 0 ? errors : { _error: error.message };
      next(err);
    }
  };

export default validate;
