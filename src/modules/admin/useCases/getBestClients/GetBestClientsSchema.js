const Joi = require("joi");
const { appErrorSchema } = require("../../../shared/infra/http/schemas/AppErrorSchema");

const getBestClientsQuerySchema = Joi.object({
    start: Joi.date().iso().description("Start date").example("2020-08-01"),
    end: Joi.date().iso().description("End date").example("2020-08-31"),
    limit: Joi.number().greater(0).integer().description("Limit of clients to return").example(3)
}).custom((value, helpers) => {
    if (value.start && value.end && value.start > value.end) {
        return helpers.message("Start date must be less than end date")
    }
    return value
})

const bestClientSchema = Joi.object({
    id: Joi.number().integer().description("Client id"),
    fullName: Joi.string().description("Client full name"),
    paid: Joi.number().description("Total paid amount")
})

const getBestClientsResponseSchema = {
    [200]: Joi.array().items(bestClientSchema),
    [404]: appErrorSchema
}


module.exports = { getBestClientsResponseSchema, getBestClientsQuerySchema }