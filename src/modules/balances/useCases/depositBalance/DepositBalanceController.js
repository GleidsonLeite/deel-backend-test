const { DepositBalanceUseCase } = require("./DepositBalanceUseCase");

class DepositBalanceController {
    /**
     * 
     * @param {import("express").Request} request 
     * @param {import("express").Response} response 
     * @returns {Promise<import("express").Response>}
     */
    async handle(request, response) {
        const { amount } = request.body;
        const { userId } = request.params
        const { profile } = request
        const { 
            Contract: contractModel,
            Job: jobModel,
            Profile: profileModel,
        } = request.app.get('models')

        const depositBalanceUseCase = new DepositBalanceUseCase({
            contractModel,
            jobModel,
            profileModel
        })

        await depositBalanceUseCase.execute({ 
            amount, 
            fromClientId: profile.id, 
            toClientId: userId
        })

        return response.status(204).send()
    }
}

module.exports = { DepositBalanceController }