const { profileTypeEnum } = require("../../../profile/enums/ProfileTypeEnum");
const { AppError } = require("../../../shared/error/AppError");
const { PayJobUseCase } = require("./PayJobUseCase");

class PayJobController {
    /**
     * 
     * @param {import("express").Request} request 
     * @param {import("express").Response} response
     * @returns {Promise<import("express").Response>}
     */
    async handle(request, response) {
        const { profile } = request;

        if (profile.type !== profileTypeEnum.CLIENT) {
            throw new AppError("Only clients can pay for jobs", 403);
        }

        const { 
            Job: jobModel,
            Profile: profileModel,
            Contract: contractModel
        } = request.app.get('models')

        const { job_id: jobId } = request.params;

        const payJobUseCase = new PayJobUseCase({
            contractModel,
            jobModel,
            profileModel
        });

        const paidJob = await payJobUseCase.execute({ clientId: profile.id, jobId });

        return response.json(paidJob);
    }
}

module.exports = { PayJobController }