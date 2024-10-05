const joi = require("joi")

const profileHeaderSchema = joi.object({
    profile_id: joi.number().integer().required().description("Profile id")
})

module.exports = { profileHeaderSchema }