const { Op } = require("sequelize")
const { contractStatusEnum } = require("../../enums/ContractStatusEnum")

class ListContractsByProfileIdUseCase {
    /**
     * 
     * @param {object} parameters
     * @param {import("../../../../model").IContract} parameters.contractModel
     */
    constructor({ contractModel }) {
        this.contractModel = contractModel
    }

    /**
     * 
     * @param {object} parameters
     * @param {number} parameters.profileId
     * @returns {Promise<import("../../../../model").IContract[]>}
     */
    async execute(parameters) {
        const { profileId } = parameters
        return this.contractModel.findAll({
            where: {
                status: {
                    [Op.ne]: contractStatusEnum.TERMINATED
                },
                [Op.or]: [
                    { ContractorId: profileId },
                    { ClientId: profileId }
                ]
            }
        })
        
    }

}

module.exports = { ListContractsByProfileIdUseCase }