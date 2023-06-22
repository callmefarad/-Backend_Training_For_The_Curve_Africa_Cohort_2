const Joi = require('@hapi/joi');

const validateProfile = (req, res, next) => {
  const schema = Joi.object({
    profileName: Joi.string().required(),
    profilePhone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    profileImage: Joi.string().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    // Handle validation error
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateProfile;

// validation 2
// const validateProfile = (data) => {
//     const schema = Joi.object({
//     profileName: Joi.string().required(),
//     profilePhone: Joi.string().pattern(/^[0-9]{10}$/).required(),
//     profileImage: Joi.string().required()
//     } );
    
//     return schema.validate( data );
// }

// module.exports.validateProfile = validateProfile;