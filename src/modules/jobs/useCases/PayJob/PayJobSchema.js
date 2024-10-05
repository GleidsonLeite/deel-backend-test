const Joi = require("joi");
const { jobSchema } = require("../../infra/http/schemas/JobSchema");
const { appErrorSchema } = require("../../../shared/infra/http/schemas/AppErrorSchema");

const payJobParamsSchema = Joi.object({
    job_id: Joi.number().integer().required().description("Job id"),
})

const payJobResponsesSchema = {
    200: jobSchema,
    400: appErrorSchema,
    404: appErrorSchema,
    403: appErrorSchema,
}

module.exports = { payJobParamsSchema, payJobResponsesSchema }