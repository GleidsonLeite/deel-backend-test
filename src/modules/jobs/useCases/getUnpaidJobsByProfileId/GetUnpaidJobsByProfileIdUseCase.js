const { Op } = require("sequelize")
const { contractStatusEnum } = require("../../../contracts/enums/ContractStatusEnum")

class GetUnpaidJobsByProfileIdUseCase {
    /**
     * 
     * @param {object} parameters
     * @param {import("../../../../model").IJob} parameters.jobModel
     * @param {import("../../../../model").IContract} parameters.contractModel
     */
    constructor({ jobModel, contractModel }) {
        this.jobModel = jobModel
        this.contractModel = contractModel
    }

    /**
     * 
     * @param {object} parameters
     * @param {number} parameters.profileId
     * @returns {Promise<import("../../../../model").IJob[]>}
     */
    async execute(parameters) {
        const { profileId } = parameters
        return this.jobModel.findAll({
            include: [{
                model: this.contractModel,
                where: {
                    status: contractStatusEnum.IN_PROGRESS,
                    [Op.or]: [
                        { ClientId: profileId },
                        { ContractorId: profileId }
                    ]
                },
                required: true
            }],
            where: {
                paid: {
                    [Op.not]: true
                }
            }
        })
    }
}

module.exports = { GetUnpaidJobsByProfileIdUseCase }