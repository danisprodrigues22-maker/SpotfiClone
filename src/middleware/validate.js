// src/middleware/validate.js
const Joi = require("joi");

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      req.body = validated;
      next();
    } catch (error) {
      return res.status(400).json({
        message: "Payload inválido",
        errors: error.details.map(d => d.message)
      });
    }
  };
};

module.exports = validate;
