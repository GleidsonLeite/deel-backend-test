const { GetBestClientsController } = require("./GetBestClientsController")
const { GetBestClientsUseCase } = require("./GetBestClientsUseCase")

jest.mock('./GetBestClientsUseCase')

describe("GetBestClientsController", () => {
    /**@type {GetBestClientsController} */
    let getBestClientsController
    /**@type {import("express").Request} */
    let mockRequest
    /**@type {import("express").Response} */
    let mockResponse

    const startDate = new Date()
    const endDate = new Date()
    const limit = 2

    beforeEach(() => {
        getBestClientsController = new GetBestClientsController()

        mockRequest = {
            query: {
                start: startDate,
                end: endDate,
                limit
            },
            app: {
                get: jest.fn().mockReturnValue({
                    Contract: {},
                    Profile: {},
                    Job: {}
                })
            }
        }

        mockResponse = {
            json: jest.fn().mockReturnThis()
        }
    })

    it("should return the list of best clients on success", async () => {
        const mockClients = [
            { id: 1 },
            { id: 2 }
        ]

        const executeMock = jest.fn().mockResolvedValue(mockClients)

        GetBestClientsUseCase.mockImplementation(() => ({
            execute: executeMock
        }))

        await getBestClientsController.handle(mockRequest, mockResponse)

        expect(GetBestClientsUseCase).toHaveBeenCalledWith({
            contractsModel: {},
            jobsModel: {},
            profilesModel: {}
        })

        expect(executeMock).toHaveBeenCalledWith({ startDate, endDate, limit })

        expect(mockResponse.json).toHaveBeenCalledWith(mockClients)
    })
})