const Joi = require('joi');

const schema =  Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(30).required(),
  description: Joi.string().required(),
  done: Joi.boolean(),
  id: Joi.string().alphanum().min(8).max(8)
}).with('name', 'description').without('id', 'done');

module.exports = schema;