const { Op } = require("sequelize");
const { GetContractByIdUseCase } = require("./GetContractByIdUseCase");

describe('GetContractByIdUseCase', () => {
    let contractsModelMock;
    /**@type {GetContractByIdUseCase} */
    let getContractByIdUseCase;

    beforeEach(() => {
        contractsModelMock = {
            findOne: jest.fn()
        }
        getContractByIdUseCase = new GetContractByIdUseCase({
            contractsModel: contractsModelMock
        })
    })

     it("should return the contract when found for the client or contractor", async () => {
        const contract = { id: 1, ClientId: 123, ContractorId: 456 }
        contractsModelMock.findOne.mockResolvedValue(contract)

        const result = await getContractByIdUseCase.execute({ profileId: 1, contractId: 123 })

        expect(result).toEqual(contract)
     })

     it("should throw an error when contract is not found", async () => {
        contractsModelMock.findOne.mockResolvedValue(null)
        const profileId = 1
        const contractId = 123
        try {
            await getContractByIdUseCase.execute({ profileId, contractId })
            fail("should have thrown an error")
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
            expect(error.message).toBe("Contract not found")
            expect(error.statusCode).toBe(404)
        }

        expect(contractsModelMock.findOne).toHaveBeenCalledWith({
            where: {
                id: contractId,
                [Op.or]: [
                    { ClientId: profileId },
                    { ContractorId: profileId }
                ]
            }
        });
     })
})