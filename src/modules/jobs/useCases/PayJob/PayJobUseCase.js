const sequelize = require("sequelize")
const { sequelize: sequelizeInstance } = require("../../../../model")
const { AppError } = require("../../../shared/error/AppError")

class PayJobUseCase {
    /**
     * 
     * @param {object} parameters
     * @param {import("../../../../model").IJobModel} parameters.jobModel
     * @param {import("../../../../model").IContractModel} parameters.contractModel
     * @param {import("../../../../model").IProfileModel} parameters.profileModel
     */
    constructor({ contractModel, jobModel, profileModel }) {
        this.jobModel = jobModel
        this.contractModel = contractModel
        this.profileModel = profileModel
    }

    /**
     * 
     * @param {object} parameters
     * @param {number} parameters.jobId
     * @param {number} parameters.clientId
     */
    async execute({ clientId, jobId }) {
        return sequelizeInstance.transaction({
            isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async (transaction) => {
            const foundJob = await this.jobModel.findOne({
                where: { id: jobId },
                include: [{
                    model: this.contractModel,
                    include: [
                        { model: this.profileModel, as: 'Client' },
                        { model: this.profileModel, as: 'Contractor' }
                    ]
                }],
                lock: sequelize.Transaction.LOCK.UPDATE,
                transaction
            })

            if (!foundJob) {
                throw new AppError('Job not found', 404)
            }

            if (foundJob.paid) {
                throw new AppError('Job has already been paid', 400)
            }

            if (foundJob.Contract.ClientId !== clientId) {
                throw new AppError('You are anot authorized to pay for this job', 403)
            }

            const client = foundJob.Contract.Client
            const contractor = foundJob.Contract.Contractor

            if (client.balance < foundJob.price) {
                throw new AppError('Insufficient balance', 400)
            }

            await client.decrement('balance', { by: foundJob.price, transaction })
            await contractor.increment('balance', { by: foundJob.price, transaction })
            foundJob.paid = true
            foundJob.paymentDate = new Date()
            await foundJob.save({ transaction })

            return {
                id: foundJob.id,
                description: foundJob.description,
                price: foundJob.price,
                paid: foundJob.paid,
                paymentDate: foundJob.paymentDate,
                createdAt: foundJob.createdAt,
                updatedAt: foundJob.updatedAt,
                ContractId: foundJob.ContractId
            }
        })
    }
}

module.exports = { PayJobUseCase }