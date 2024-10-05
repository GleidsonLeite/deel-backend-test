const sequelize = require("sequelize");
const { AppError } = require("../../../shared/error/AppError");

/**
 * @typedef {object} IResponse
 * @property {string} profession
 * @property {number} totalEarned
 */

class GetBestProfessionUseCase {
    /**
     * 
     * @param {object} parameters
     * @param {import("../../../../model").IJobModel} parameters.jobModel
     * @param {import("../../../../model").IContractModel} parameters.contractModel
     * @param {import("../../../../model").IProfileModel} parameters.profileModel
     */
    constructor({ jobModel, contractModel, profileModel }) {
        this.jobModel = jobModel
        this.contractModel = contractModel
        this.profileModel = profileModel
    }
    
    /**
     * 
     * @param {object} parameters
     * @param {Date} parameters.startDate
     * @param {Date} parameters.endDate
     * @returns {Promise<IResponse>}
     */
    async execute({ startDate, endDate }) {
        const result = await this.jobModel.findOne({
            attributes: [
                [sequelize.col('Contract.Contractor.profession'), 'profession'],
                [sequelize.fn('SUM', sequelize.col('Job.price')), 'totalEarned']
            ],
            include: [{
                model: this.contractModel,
                attributes: [],
                include: [{
                    model: this.profileModel,
                    as: 'Contractor',
                    attributes: []
                }]
            }],
            where: {
                paid: true,
                paymentDate: {
                    [sequelize.Op.between]: [startDate, endDate]
                }
            },
            group: ['Contract.Contractor.profession'],
            order: [[sequelize.fn('SUM', sequelize.col('Job.price')), 'DESC']],
            raw: true
        })

        if (!result) {
            throw new AppError('No paid jobs found in the specified date range', 404)
        }

        return {
            profession: result.profession,
            totalEarned: result.totalEarned
        }
    }
}

module.exports = { GetBestProfessionUseCase };