const sequelize = require("sequelize");

const { profileTypeEnum } = require("../../../profile/enums/ProfileTypeEnum");
const { AppError } = require("../../../shared/error/AppError");
const { contractStatusEnum } = require("../../../contracts/enums/ContractStatusEnum");
const { sequelize: sequelizeInstance } = require("../../../../model");

class DepositBalanceUseCase {
    /**
     * 
     * @param {object} parameters
     * @param {import("../../../../model").IProfileModel} parameters.profileModel
     * @param {import("../../../../model").IJobModel} parameters.jobModel
     * @param {import("../../../../model").IContractModel} parameters.contractModel
     */
    constructor({
        contractModel,
        jobModel,
        profileModel
    }) {
        this.jobModel = jobModel
        this.contractModel = contractModel
        this.profileModel = profileModel
        this.maxPercentageOfTotalJobsToPay = 0.25;
    }

    /**
     * 
     * @param {object} parameters
     * @param {number} parameters.fromClientId
     * @param {number} parameters.toClientId
     * @param {number} parameters.amount
     * @returns {Promise<void>}
     */
    async execute({ amount, fromClientId, toClientId }) {
        if (fromClientId === toClientId) {
            throw new AppError('Cannot deposit to the same client', 400)
        }
        return sequelizeInstance.transaction({
            isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async (transaction) => {
            const [fromClient, toClient] = await Promise.all([
                this.profileModel.findOne({
                    where: { id: fromClientId, type: profileTypeEnum.CLIENT },
                    lock: sequelize.Transaction.LOCK.UPDATE,
                    transaction
                }),
                this.profileModel.findOne({
                    where: { id: toClientId, type: profileTypeEnum.CLIENT },
                    lock: sequelize.Transaction.LOCK.UPDATE,
                    transaction
                })
            ])

            if (!fromClient) {
                throw new AppError('Sender Client not found', 404)
            }

            if (!toClient) {
                throw new AppError('Recipient Client not found', 404)
            }

            if (fromClient.balance < amount) {
                throw new AppError('Insufficient balance', 400)
            }

            const totalJobsToPay = await this.jobModel.sum('price', {
                include: [{
                    model: this.contractModel,
                    where: { ClientId: toClientId, status: contractStatusEnum.IN_PROGRESS },
                    required: true
                }],
                where: {
                    paid: {
                        [sequelize.Op.not]: true
                    }
                },
                transaction
            })

            const maxDeposit = totalJobsToPay * this.maxPercentageOfTotalJobsToPay;

            if (amount > maxDeposit) {
                throw new AppError(`Deposit amounts exceeds ${this.maxPercentageOfTotalJobsToPay * 100}% of total jobs to pay. Maximum Allowed: ${maxDeposit}`, 400)
            }

            await fromClient.decrement('balance', { by: amount, transaction })
            await toClient.increment('balance', { by: amount, transaction })
        })
    }
}

module.exports = { DepositBalanceUseCase };