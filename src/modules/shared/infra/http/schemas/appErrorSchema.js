const joi = require("joi")

const appErrorSchema = joi.object({
    message: joi.string().description('Error message'),
})

module.exports = { appErrorSchema }