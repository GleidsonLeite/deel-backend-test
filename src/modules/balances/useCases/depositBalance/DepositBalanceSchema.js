const Joi = require("joi");
const { appErrorSchema } = require("../../../shared/infra/http/schemas/AppErrorSchema");

const depositBalanceParamsSchema = Joi.object({
    userId: Joi.number().integer().required().description("User id"),
})

const depositBalanceBodySchema = Joi.object({
    amount: Joi.number().positive().greater(0).required().description("Amount to deposit"),
})

const depositBalanceResponsesSchema = {
    204: Joi.any().empty(),
    400: appErrorSchema,
    404: appErrorSchema,
}

module.exports = { depositBalanceParamsSchema, depositBalanceBodySchema, depositBalanceResponsesSchema }