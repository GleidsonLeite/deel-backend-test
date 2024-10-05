const { Router } = require("express");

const { getProfile } = require("../../../../../middleware/getProfile");

const { GetContractByIdController } = require("../../../useCases/getContractById/GetContractByIdController");
const { ListContractsByProfileIdController } = require("../../../useCases/listContractsByProfileIdUseCase/ListContractsByProfileIdController");
const { registerRoute } = require("../../../../shared/infra/http/routes/registerRoute");
const { httpRequestMethodsEnum } = require("../../../../shared/infra/http/enums/httpRequestMethodsEnum");
const { getContractByIdParamsSchema, getContractByIdResponseSchema } = require("../../../useCases/getContractById/GetContractByIdSchema");
const { profileHeaderSchema } = require("../../../../shared/infra/http/schemas/profileHeaderSchema");
const { listContractsByProfileIdResponseSchema } = require("../../../useCases/listContractsByProfileIdUseCase/ListContractsByProfileIdSchemas");

const contractsRouter = Router()

const getContractByIdController = new GetContractByIdController()
const listContractsByProfileIdController = new ListContractsByProfileIdController()

registerRoute(contractsRouter, {
    method: httpRequestMethodsEnum.GET,
    description: "Get contract by id",
    summary: "Get contract by id",
    handler: getContractByIdController.handle,
    path: "/contracts/:id",
    middlewares: [getProfile],
    schema: {
        params: getContractByIdParamsSchema,
        headers: profileHeaderSchema,
        responses: getContractByIdResponseSchema
    },
    tags: ["Contracts"],
})

registerRoute(contractsRouter, {
    method: httpRequestMethodsEnum.GET,
    description: "List contracts by profile id",
    summary: "List contracts by profile id",
    handler: listContractsByProfileIdController.handle,
    path: "/contracts",
    middlewares: [getProfile],
    schema: {
        headers: profileHeaderSchema,
        responses: listContractsByProfileIdResponseSchema
    },
    tags: ["Contracts"],
})

module.exports = { contractsRouter }