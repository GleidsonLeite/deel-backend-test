require("express-async-errors")
const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const { errorMiddleware } = require('./modules/shared/infra/http/middlewares/ErrorMiddleware');
const { appRouter } = require("./modules/shared/infra/http/routes/app.routes");
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use(appRouter)

app.use(errorMiddleware)

module.exports = app;
