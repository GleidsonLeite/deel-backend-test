const { ListContractsByProfileIdController } = require("./ListContractsByProfileIdController")
const { ListContractsByProfileIdUseCase } = require("./ListContractsByProfileIdUseCase")

jest.mock('./ListContractsByProfileIdUseCase')

describe("ListContractsByProfileIdController", () => {
    /**@type {ListContractsByProfileIdController} */
    let listContractsByProfileIdController
    /**@type {import("express").Request} */
    let mockRequest
    /**@type {import("express").Response} */
    let mockResponse

    const profileId = 123

    beforeEach(() => {
        listContractsByProfileIdController = new ListContractsByProfileIdController()

        mockRequest = {
            app: {
                get: jest.fn().mockReturnValue({
                    Contract: {}
                })
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

    it("should return a list of contracts when found", async () => {
        const mockContracts = [
            { id: 1 },
            { id: 2 }
        ]

        const listContractsByProfileIdUseCaseExecute = jest.fn().mockResolvedValue(mockContracts)

        ListContractsByProfileIdUseCase.mockImplementation(() => ({
            execute: listContractsByProfileIdUseCaseExecute
        }))

        await listContractsByProfileIdController.handle(mockRequest, mockResponse)

        expect(ListContractsByProfileIdUseCase).toHaveBeenCalledWith({
            contractModel: {}
        })

        expect(listContractsByProfileIdUseCaseExecute).toHaveBeenCalledWith({ profileId })

        expect(mockResponse.json).toHaveBeenCalledWith(mockContracts)
    })

    it("should return an empty array when no contracts are found", async () => {
        const listContractsByProfileIdUseCaseExecute = jest.fn().mockResolvedValue([])

        ListContractsByProfileIdUseCase.mockImplementation(() => ({
            execute: listContractsByProfileIdUseCaseExecute
        }))

        await listContractsByProfileIdController.handle(mockRequest, mockResponse)

        expect(ListContractsByProfileIdUseCase).toHaveBeenCalledWith({
            contractModel: {}
        })

        expect(listContractsByProfileIdUseCaseExecute).toHaveBeenCalledWith({ profileId })

        expect(mockResponse.json).toHaveBeenCalledWith([])
    })
})