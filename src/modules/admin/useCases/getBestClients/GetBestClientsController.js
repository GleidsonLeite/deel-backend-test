const { GetBestClientsUseCase } = require("./GetBestClientsUseCase")

class GetBestClientsController {
    async handle(request, response) {
        const { start: startDate, end: endDate, limit } = request.query
        const { 
            Contract: contractsModel,
            Profile: profilesModel,
            Job: jobsModel
        } = request.app.get('models')

        const getBestClientsUseCase = new GetBestClientsUseCase({
            contractsModel,
            jobsModel,
            profilesModel
        })

        const result = await getBestClientsUseCase.execute({ startDate, endDate, limit })

        return response.json(result)
    }
}

module.exports = { GetBestClientsController }