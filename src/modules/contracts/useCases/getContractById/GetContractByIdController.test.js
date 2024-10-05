const { AppError } = require("../../../shared/error/AppError")
const { GetContractByIdController } = require("./GetContractByIdController")
const { GetContractByIdUseCase } = require("./GetContractByIdUseCase")

jest.mock("./GetContractByIdUseCase")

describe('GetContractByIdController', () => {
    /**@type {GetContractByIdController} */
    let getContractByIdController
    /**@type {import("express").Request} */
    let mockRequest;
    /**@type {import("express").Response} */
    let mockResponse;
    const contractId = 1
    const profileId = 123

    beforeEach(() => {
        getContractByIdController = new GetContractByIdController()
        
        mockRequest = {
            app: {
                get: jest.fn().mockReturnValue({
                    Contract: {}
                })
            },
            params: {
                id: contractId
            },
            profile: {
                id: profileId
            }
        }

        mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        }
    })

    it("should return the contract when found", async () => {
        const mockFoundContract = { id: contractId }

        GetContractByIdUseCase.mockImplementation(() => ({
            execute: jest.fn().mockResolvedValue(mockFoundContract)
        }))

        await getContractByIdController.handle(mockRequest, mockResponse)

        expect(GetContractByIdUseCase).toHaveBeenCalledWith({
            contractsModel: {}
        })

        expect(mockResponse.json).toHaveBeenCalledWith(mockFoundContract)
    })
})