const { Op } = require("sequelize");
const { ListContractsByProfileIdUseCase } = require("./ListContractsByProfileIdUseCase");
const { contractStatusEnum } = require("../../enums/ContractStatusEnum");

describe('ListContractsByProfileIdUseCase', () => {
    /**@type {ListContractsByProfileIdUseCase} */
    let listContractsByProfileIdUseCase;
    let contractModelMock;

    beforeEach(() => {
        contractModelMock = {
            findAll: jest.fn()
        }
        listContractsByProfileIdUseCase = new ListContractsByProfileIdUseCase({
            contractModel: contractModelMock
        })
    })

    it("should return a list of contracts when found", async () => {
        const mockContracts = [
            { id: 1 },
            { id: 2 }
        ]
        contractModelMock.findAll.mockResolvedValue(mockContracts)

        const profileId = 123

        const result = await listContractsByProfileIdUseCase.execute({ profileId })

        expect(contractModelMock.findAll).toHaveBeenCalledWith({
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

        expect(result).toEqual(mockContracts)
    })

    it("should return an empty array when no contracts are found", async () => {
        contractModelMock.findAll.mockResolvedValue([])

        const profileId = 123

        const result = await listContractsByProfileIdUseCase.execute({ profileId })

        expect(contractModelMock.findAll).toHaveBeenCalledWith({
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

        expect(result).toEqual([])
    })
})