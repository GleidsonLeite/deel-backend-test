const joi = require("joi")
const { contractSchema } = require("../../infra/http/schemas/ContractSchema")
const { appErrorSchema } = require("../../../shared/infra/http/schemas/AppErrorSchema")

const getContractByIdParamsSchema = joi.object({
    id: joi.number().integer().required().description("Contract id")
})

const getContractByIdResponseSchema = {
    [200]: contractSchema,
    [404]: appErrorSchema
}

module.exports = { getContractByIdParamsSchema, getContractByIdResponseSchema }