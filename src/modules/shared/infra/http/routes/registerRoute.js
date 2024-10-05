const { validationMiddleware } = require("../middlewares/validationMiddelware")
const convert = require("joi-to-swagger")

const routes = []

const registerRoute = (router, {
    method,
    path,
    schema = {},
    handler,
    middlewares = [],
    summary,
    description,
    tags = [],
}) => {
    if (schema && Object.keys(schema).length > 0) {
        middlewares.unshift(validationMiddleware(schema))
    }

    router[method](path, ...middlewares, handler);

    const parameters = []
    const requestBody = {}

    if (schema.params) {
        const { swagger: paramsSwagger } = convert(schema.params)
        parameters.push(
            ...Object.keys(paramsSwagger.properties).map((key) => ({
                name: key,
                in: 'path',
                required: schema.params._flags.presence === 'required',
                schema: paramsSwagger.properties[key],
                description: paramsSwagger.properties[key].description
            }))
        )
    }

    if (schema.query) {
        const { swagger: querySwagger } = convert(schema.query)
        parameters.push(
            ...Object.keys(querySwagger.properties).map((key) => ({
                name: key,
                in: 'query',
                required: schema.query._flags.presence === 'required',
                schema: querySwagger.properties[key],
                description: querySwagger.properties[key].description
            }))
        )
    }

    if (schema.headers) {
        const { swagger: headersSwagger } = convert(schema.headers)
        parameters.push(
            ...Object.keys(headersSwagger.properties).map((key) => ({
                name: key,
                in: 'header',
                required: schema.headers._flags.presence === 'required',
                schema: headersSwagger.properties[key],
                description: headersSwagger.properties[key].description
            }))
        )
    }

    if (schema.body) {
        const { swagger: bodySwagger } = convert(schema.body)
        requestBody.content = {
            'application/json': {
                schema: bodySwagger
            }
        }
    }

    const swaggerResponses = {}

    if (schema.responses) {
        for (const [statusCode, responseSchema] of Object.entries(schema.responses)) {
            const { swagger: responseSwagger } = convert(responseSchema)
            swaggerResponses[statusCode] = {
                description: responseSchema._description || 'Response',
                content: {
                    'application/json': {
                        schema: responseSwagger
                    }
                }
            }
        }
    }

    const routeInfo = {
        path,
        method,
        summary,
        description,
        tags,
        parameters,
        ...(Object.keys(requestBody).length && { requestBody}),
        responses: swaggerResponses
    }

    routes.push(routeInfo)
}

module.exports = { registerRoute, routes }