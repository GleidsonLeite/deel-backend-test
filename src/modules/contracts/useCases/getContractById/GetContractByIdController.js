const { GetContractByIdUseCase } = require("./GetContractByIdUseCase")

class GetContractByIdController {
    /**
     * 
     * @param {import("express").Request} request 
     * @param {import("express").Response} response
     * @returns {Promise<import("express").Response>}
     */
    async handle(request, response) {
        const { Contract: contractsModel } = request.app.get('models')
        const { id: contractId } = request.params
        
        const getContractByIdUseCase = new GetContractByIdUseCase({
            contractsModel
        })

        const foundContract = await getContractByIdUseCase.execute({ 
            contractId,
            profileId: request.profile.id
        })

        return response.json(foundContract)
    }
}

module.exports = { GetContractByIdController }