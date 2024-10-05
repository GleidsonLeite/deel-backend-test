const { Router } = require("express");
const { GetUnpaidJobsByProfileIdController } = require("../../../useCases/getUnpaidJobsByProfileId/GetUnpaidJobsByProfileIdController");
const { getProfile } = require("../../../../../middleware/getProfile");
const { PayJobController } = require("../../../useCases/PayJob/PayJobController");
const { registerRoute } = require("../../../../shared/infra/http/routes/registerRoute");
const { httpRequestMethodsEnum } = require("../../../../shared/infra/http/enums/httpRequestMethodsEnum");
const { getUnpaidJobsByProfileIdResponseSchema } = require("../../../useCases/getUnpaidJobsByProfileId/GetUnpaidJobsByProfileIdSchema");
const { profileHeaderSchema } = require("../../../../shared/infra/http/schemas/profileHeaderSchema");
const { payJobParamsSchema, payJobResponsesSchema } = require("../../../useCases/PayJob/PayJobSchema");

const jobsRouter = Router()

const getUnpaidJobsByProfileIdController = new GetUnpaidJobsByProfileIdController()
const payJobController = new PayJobController()

registerRoute(jobsRouter, {
    method: httpRequestMethodsEnum.GET,
    description: "Get unpaid jobs by profile id",
    summary: "Get unpaid jobs by profile id",
    handler: getUnpaidJobsByProfileIdController.handle,
    path: "/jobs/unpaid",
    middlewares: [getProfile],
    schema: {
        responses: getUnpaidJobsByProfileIdResponseSchema,
        headers: profileHeaderSchema
    },
    tags: ["Jobs"],
})

registerRoute(jobsRouter, {
    method: httpRequestMethodsEnum.POST,
    description: "Pay job",
    summary: "Pay job",
    handler: payJobController.handle,
    path: "/jobs/:job_id/pay",
    middlewares: [getProfile],
    schema: {
        headers: profileHeaderSchema,
        params: payJobParamsSchema,
        responses: payJobResponsesSchema
    },
    tags: ["Jobs"],
})
module.exports = { jobsRouter }