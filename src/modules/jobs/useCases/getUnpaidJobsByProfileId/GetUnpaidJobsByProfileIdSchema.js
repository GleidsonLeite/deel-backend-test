const Joi = require("joi");
const { jobSchema } = require("../../infra/http/schemas/JobSchema");
const { contractSchema } = require("../../../contracts/infra/http/schemas/ContractSchema");

const getUnpaidJobsByProfileIdResponseSchema = {
    200: Joi.array().items(jobSchema.append({
        Contract: contractSchema
    }))
}

module.exports = { getUnpaidJobsByProfileIdResponseSchema }