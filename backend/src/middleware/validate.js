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
      res.status(400).json({
        success: false,
        message:
          "Validation failed.",
        errors: error.details?.map(
          (detail) => detail.message
        ) || [error.message],
      });
    }
  };

export default validate;
