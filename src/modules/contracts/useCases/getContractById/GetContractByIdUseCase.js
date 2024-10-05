const { Op } = require("sequelize");
const { AppError } = require("../../../shared/error/AppError");

class GetContractByIdUseCase {
    /**
     * 
     * @param {object} parameters
     * @param {import("../../../../model").IContractModel} parameters.contractsModel
     */
    constructor({ contractsModel }) {
        this.contractsModel = contractsModel
    }

    /**
     * 
     * @param {object} parameters
     * @param {number} parameters.contractId
     * @param {number} parameters.profileId
     * @returns {Promise<import("../../../model").IContract | null>}
     */
    async execute({
        contractId,
        profileId
    }) {
        const contract = await this.contractsModel.findOne({
            where: {
                id: contractId,
                [Op.or]: [
                    { ClientId: profileId },
                    { ContractorId: profileId }
                ]
            }
        })

        if (!contract) {
            throw new AppError('Contract not found', 404)
        }

        return contract
    }
}

module.exports = {GetContractByIdUseCase};