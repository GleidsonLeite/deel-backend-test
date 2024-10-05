const { ListContractsByProfileIdUseCase } = require("./ListContractsByProfileIdUseCase")

class ListContractsByProfileIdController {
    /**
     * 
     * @param {import("express").Request} request 
     * @param {import("express").Response} response 
     * @returns {Promise<import("express").Response>}
     */
    async handle(request, response) {
        const { id : profileId } = request.profile
        const listContractsByProfileIdUseCase = new ListContractsByProfileIdUseCase({
            contractModel: request.app.get('models').Contract
        })
        const contracts = await listContractsByProfileIdUseCase.execute({ profileId })
        return response.json(contracts)
    }
}

module.exports = {ListContractsByProfileIdController}