const { GetUnpaidJobsByProfileIdUseCase } = require("./GetUnpaidJobsByProfileIdUseCase")

class GetUnpaidJobsByProfileIdController {
    async handle(request, response) {
        const { id: profileId } = request.profile
        const getUnpaidJobsByProfileIdUseCase = new GetUnpaidJobsByProfileIdUseCase({
            contractModel: request.app.get('models').Contract,
            jobModel: request.app.get('models').Job
        })
        const jobs = await getUnpaidJobsByProfileIdUseCase.execute({ profileId })
        return response.json(jobs)
    }
}

module.exports = { GetUnpaidJobsByProfileIdController }