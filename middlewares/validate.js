const {userCreationSchema,userUpdateSchema,userLoginSchema} = require('../utils/user.validationSchema.js');
const {taskCreationSchema,taskUpdateSchema} = require('../utils/task.validationSchema.js');
const validateRegister = (req, res, next) => {
  const { error ,value} = userCreationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = structuredClone(value);
  next();
}
const validateUserUpdate = (req, res, next) => {
  const { error ,value} = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = structuredClone(value);
  next();
}
const validateTaskCreation = (req, res, next) => {
  const { error ,value} = taskCreationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = structuredClone(value);
  next();
}
const validateTaskUpdate = (req, res, next) => {
  const { error ,value} = taskUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = structuredClone(value);
  next();
}
const validateLogin = (req, res, next) => {
  const { error ,value} = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = structuredClone(value);
  next();
}
module.exports = {
  validateRegister,
  validateUserUpdate,
  validateTaskCreation,
  validateTaskUpdate,
  validateLogin
}
