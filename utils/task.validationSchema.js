const Joi = require("joi");
const moment = require("moment");
const taskCreationSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required(),
  description: Joi.string().trim().max(200),
  status: Joi.string()
    .trim()
    .valid("todo", "inprogress", "done")
    .default("todo"),
  priority: Joi.string().trim().valid("low", "medium", "high").default("low"),
  deadline: Joi.date().greater("now").default(moment().format("llll")),
  createdAt: Joi.string().default(moment().format("llll")),
  createdBy: Joi.string().trim(),
});
const taskUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50),
  description: Joi.string().trim().max(200),
  status: Joi.string()
    .trim()
    .valid("todo", "inprogress", "done")
    .default("todo"),
  priority: Joi.string().trim().valid("low", "medium", "high").default("low"),
  deadline: Joi.date().greater("now").default(moment().format("llll")),
  createdAt: Joi.date().default(moment().format("llll")),
  createdBy: Joi.string().trim(),
});
module.exports = { taskCreationSchema, taskUpdateSchema };
