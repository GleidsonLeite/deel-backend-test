const Joi = require("joi");

const jobSchema = Joi.object({
    id: Joi.number().integer().description("Job id"),
    description: Joi.string().description("Job description"),
    price: Joi.number().positive().greater(0).description("Job price"),
    paid: Joi.boolean().description("Job paid"),
    createdAt: Joi.date().description("Job created at"),
    updatedAt: Joi.date().description("Job updated at"),
    ContractId: Joi.number().integer().description("Contract id"),
})

module.exports = { jobSchema }