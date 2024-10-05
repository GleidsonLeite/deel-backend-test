const joi = require("joi")
const { contractStatusEnum } = require("../../../enums/ContractStatusEnum")

const contractSchema = joi.object({
    id: joi.number().integer().description("Contract id"),
    terms: joi.string().description("Contract terms"),
    status: joi.string().valid(...Object.values(contractStatusEnum)).description("Contract status"),
    createdAt: joi.date().description("Contract creation date"),
    updatedAt: joi.date().description("Contract update date"),
    contractorId: joi.number().integer().description("Contractor id"),
    ClientId: joi.number().integer().description("Client id")
})

module.exports = { contractSchema }