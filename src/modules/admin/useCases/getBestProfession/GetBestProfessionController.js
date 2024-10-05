const { GetBestProfessionUseCase } = require("./GetBestProfessionUseCase")

class GetBestProfessionController {
    async handle(request, response) {
        const { start: startDate, end: endDate } = request.query
        const { 
            Job: jobModel,
            Contract: contractModel,
            Profile: profileModel,
        } = request.app.get('models')

        const getBestProfessionUseCase = new GetBestProfessionUseCase({
            jobModel,
            contractModel,
            profileModel
        })

        const result = await getBestProfessionUseCase.execute({ startDate, endDate })

        return response.json(result)
    }
}

module.exports = { GetBestProfessionController }