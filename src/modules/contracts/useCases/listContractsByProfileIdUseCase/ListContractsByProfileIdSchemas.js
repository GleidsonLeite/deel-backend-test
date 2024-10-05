const joi = require("joi")
const { contractSchema } = require("../../infra/http/schemas/ContractSchema")

const listContractsByProfileIdResponseSchema = {
    [200]: joi.array().items(contractSchema)
}

module.exports = {listContractsByProfileIdResponseSchema}