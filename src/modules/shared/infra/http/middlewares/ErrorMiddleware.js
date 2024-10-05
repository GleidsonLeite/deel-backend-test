const { AppError } = require("../../../error/AppError")

/**
 * 
 * @param {Error} error 
 * @param {import("express").Request} _request 
 * @param {import("express").Response} response 
 * @param {import("express").NextFunction} _nextFunction 
 */
const errorMiddleware = (error, _request, response, _nextFunction) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            message: error.message
        })
    } else {
        console.error(error)
        return response.status(500).json({
            message: `Internal Server Error - ${error.message}`
        })
    }
}

module.exports = { errorMiddleware}