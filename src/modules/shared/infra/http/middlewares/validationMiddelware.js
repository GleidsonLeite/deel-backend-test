const Joi = require("joi")

const schemasEnum = Object.freeze({
    BODY: 'body',
    PARAMS: 'params',
    QUERY: 'query',
    HEADERS: 'headers'
})

const validationMiddleware = (schema) => {
    return (request, response, nextFunction) => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        }

        const schemas = Object.values(schemasEnum)

        const validationResults = {};

        for (const key of schemas) {
            if (schema[key]) {
                const { error, value } = schema[key].validate(request[key], validationOptions)
                
                if (error) {
                    return response.status(400).json({
                        error: `Validation error in ${key}: ${error.details.map((x) => x.message).join(', ')}`
                    })
                } else {
                    validationResults[key] = value
                }
            }

        }

        Object.assign(request, validationResults)

        nextFunction()
    }
}

module.exports = { validationMiddleware }