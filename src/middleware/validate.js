module.exports = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          message: error.details.map(d => d.message).join(", "),
        });
      }

      req.body = value; // dados limpos
      next(); // segue para o controller
    } catch (err) {
      next(err);
    }
  };
};
