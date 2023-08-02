const Joi = require("joi");
const passwordRegExp =   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const nameRegExp = /^[a-zA-Z\s]+$/;
const emailRegExp = /^[a-z\d.]+@gmail\.com$/;
const userCreationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .regex(nameRegExp)
    .min(3)
    .max(20)
    .required(),

  email: Joi.string()
    .trim()
    .regex(emailRegExp)
    .required(),

  password: Joi.string()
  .regex(passwordRegExp)
    .min(8)
    .required(),
  isVerified: Joi.boolean().default(false),
  preferences: Joi.array(),
  role:Joi.string().valid("user","admin").default("user")
});
const userUpdateSchema = Joi.object({
    name: Joi.string()
      .trim()
      .regex(nameRegExp)
      .min(3)
      .max(20),
  
    email: Joi.string()
      .trim()
      .regex(emailRegExp),
  
    password: Joi.string()
      .min(8)
      .regex(passwordRegExp),
    preferences: Joi.array(),
});
const userLoginSchema = Joi.object({
    email: Joi.string().trim().regex(emailRegExp).required(),
    password: Joi.string().required(),
});
module.exports = { userCreationSchema,userUpdateSchema ,userLoginSchema};
