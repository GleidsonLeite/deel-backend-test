const sequelize = require('sequelize')
const { AppError } = require("../../../shared/error/AppError")

/**
 * @typedef {object} IResponse
 * @property {number} id
 * @property {string} fullName
 * @property {string} paid
 */

class GetBestClientsUseCase {
    /**
     * 
     * @param {object} parameters
     * @param {import("../../../../model").IJobModel} parameters.jobsModel
     * @param {import("../../../../model").IContractModel} parameters.contractsModel
     * @param {import("../../../../model").IProfileModel} parameters.profilesModel
     */
    constructor({ jobsModel, contractsModel, profilesModel }) {
        this.jobsModel = jobsModel
        this.contractsModel = contractsModel
        this.profilesModel = profilesModel
    }

    /**
     * 
     * @param {object} parameters
     * @param {Date} parameters.startDate
     * @param {Date} parameters.endDate
     * @param {number} parameters.limit
     * @returns {Promise<IResponse[]>}
     */
    async execute({ startDate, endDate, limit = 2 }) {
        const results = await this.jobsModel.findAll({
            attributes: [
                [sequelize.col('Contract.Client.id'), 'id'],
                [sequelize.fn('SUM', sequelize.col('Job.price')), 'paid'],
                [sequelize.literal(`firstName || ' ' || lastName`), 'fullName']
            ],
            include: [{
                model: this.contractsModel,
                attributes: [],
                include: [{
                    model: this.profilesModel,
                    as: 'Client',
                    attributes: []
                }]
            }],
            where: {
                paid: true,
                paymentDate: {
                    [sequelize.Op.between]: [startDate, endDate]
                }
            },
            group: ['Contract.Client.id', 'Contract.Client.firstName', 'Contract.Client.lastName'],
            order: [[sequelize.fn('SUM', sequelize.col('Job.price')), 'DESC']],
            limit: limit,
            raw: true
        })

        if (results.length === 0) {
            throw new AppError('No paid jobs found in the specified date range', 404)
        }

        return results.map(result => ({
            id: result.id,
            fullName: result.fullName,
            paid: result.paid
        }))
    }
}

module.exports = { GetBestClientsUseCase }