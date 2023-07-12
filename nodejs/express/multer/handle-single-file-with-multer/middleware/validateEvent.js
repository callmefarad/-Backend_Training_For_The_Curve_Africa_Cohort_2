const Joi = require('@hapi/joi');

const validateEvent = (req, res, next) => {
  const schema = Joi.object({
    // eventTitle: Joi.string(),
    // eventContent: Joi.string(),
    // titleImage: Joi.string().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    // Handle validation error
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateEvent;