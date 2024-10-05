const { routes } = require("../routes/registerRoute")

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Deel Task API',
        version: '1.0.0',
    },
    paths: {},
}

routes
    .sort((a, b) => a.path.localeCompare(b.path))
    .forEach((route) => {
    const path = route.path.replace(/:([a-z-A-Z0-9_]+)/g, '{$1}')
    if (!swaggerDocument.paths[path]) {
        swaggerDocument.paths[path] = {}
    }

    swaggerDocument.paths[path][route.method] = {
        summary: route.summary,
        description: route.description,
        tags: route.tags,
        parameters: route.parameters,
        requestBody: route.requestBody,
        responses: route.responses
    }
})

module.exports = { swaggerDocument}