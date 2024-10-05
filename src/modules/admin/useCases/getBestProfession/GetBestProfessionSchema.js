const Joi = require("joi")
const { appErrorSchema } = require("../../../shared/infra/http/schemas/AppErrorSchema")

const getBestProfessionQuerySchema = Joi.object({
    start: Joi.date().iso().description("Start date").example("2020-08-01"),
    end: Joi.date().iso().description("End date").example("2020-08-31")
}).custom((value, helpers) => {
    if (value.start && value.end && value.start > value.end) {
        return helpers.message("Start date must be less than end date")
    }
    return value
})

const bestProfessionSchema = Joi.object({
    profession: Joi.string().description("Profession name"),
    totalEarned: Joi.number().description("Total earned amount")
})

const getBestProfessionResponseSchema = {
    200: bestProfessionSchema,
    404: appErrorSchema
}

module.exports = { getBestProfessionResponseSchema, getBestProfessionQuerySchema }