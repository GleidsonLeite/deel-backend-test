const { Router, query } = require("express");
const { GetBestProfessionController } = require("../../../useCases/getBestProfession/GetBestProfessionController");
const { getProfile } = require("../../../../../middleware/getProfile");
const { GetBestClientsController } = require("../../../useCases/getBestClients/GetBestClientsController");
const { registerRoute } = require("../../../../shared/infra/http/routes/registerRoute");
const { httpRequestMethodsEnum } = require("../../../../shared/infra/http/enums/httpRequestMethodsEnum");
const { profileHeaderSchema } = require("../../../../shared/infra/http/schemas/profileHeaderSchema");
const { getBestProfessionResponseSchema, getBestProfessionQuerySchema } = require("../../../useCases/getBestProfession/GetBestProfessionSchema");
const { getBestClientsResponseSchema, getBestClientsQuerySchema } = require("../../../useCases/getBestClients/GetBestClientsSchema");

const adminRouter = Router()

const getBestProfessionCOntroller = new GetBestProfessionController()
const getBestClientsController = new GetBestClientsController()

registerRoute(adminRouter, {
    description: "Get best profession",
    handler: getBestProfessionCOntroller.handle,
    method: httpRequestMethodsEnum.GET,
    path: "/admin/best-profession",
    summary: "Get best profession",
    middlewares: [getProfile],
    schema: {
        headers: profileHeaderSchema,
        responses: getBestProfessionResponseSchema,
        query: getBestProfessionQuerySchema
    },
    tags: ["Admin"]
})

registerRoute(adminRouter, {
    description: "Get best clients",
    handler: getBestClientsController.handle,
    method: httpRequestMethodsEnum.GET,
    path: "/admin/best-clients",
    summary: "Get best clients",
    middlewares: [getProfile],
    schema: {
        headers: profileHeaderSchema,
        responses: getBestClientsResponseSchema,
        query: getBestClientsQuerySchema
    },
    tags: ["Admin"]
})

module.exports = { adminRouter }