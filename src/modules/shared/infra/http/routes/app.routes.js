const swaggerUi = require("swagger-ui-express")

const { Router } = require("express");
const { contractsRouter } = require("../../../../contracts/infra/http/routes/contract.routes");
const { jobsRouter } = require("../../../../jobs/infra/http/routes/jobs.routes");
const { balancesRouter } = require("../../../../balances/infra/http/routes/balances.routes");
const { adminRouter } = require("../../../../admin/infra/http/routes/admin.routes");
const { swaggerDocument } = require("../swagger/swaggerConfig");

const appRouter = Router();

appRouter.use(contractsRouter);
appRouter.use(jobsRouter)
appRouter.use(adminRouter)
appRouter.use(balancesRouter)
appRouter.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

module.exports = { appRouter };