const { Router } = require("express");
const { getProfile } = require("../../../../../middleware/getProfile");
const { DepositBalanceController } = require("../../../useCases/depositBalance/DepositBalanceController");
const { registerRoute } = require("../../../../shared/infra/http/routes/registerRoute");
const { httpRequestMethodsEnum } = require("../../../../shared/infra/http/enums/httpRequestMethodsEnum");
const { depositBalanceParamsSchema, depositBalanceBodySchema, depositBalanceResponsesSchema } = require("../../../useCases/depositBalance/DepositBalanceSchema");
const { profileHeaderSchema } = require("../../../../shared/infra/http/schemas/profileHeaderSchema");

const balancesRouter = Router()
const depositBalanceController = new DepositBalanceController()

registerRoute(balancesRouter, {
    description: "Deposit balance",
    handler: depositBalanceController.handle,
    method: httpRequestMethodsEnum.POST,
    path: "/balances/deposit/:userId",
    summary: "Deposit balance",
    middlewares: [getProfile],
    schema: {
        params: depositBalanceParamsSchema,
        headers: profileHeaderSchema,
        body: depositBalanceBodySchema,
        responses: depositBalanceResponsesSchema
    },
    tags: ["Balances"]
})

module.exports = { balancesRouter }