const { DepositBalanceController } = require("./DepositBalanceController")
const { DepositBalanceUseCase } = require("./DepositBalanceUseCase")

jest.mock('./DepositBalanceUseCase')

describe("DepositBalanceController", () => {
    /**@type {DepositBalanceController} */
    let depositBalanceController
    /**@type {import("express").Request} */
    let mockRequest
    /**@type {import("express").Response} */
    let mockResponse

    beforeEach(() => {
        depositBalanceController = new DepositBalanceController()

        mockRequest = {
            body: { amount: 100 },
            params: { userId: 2 },
            profile: { id: 1 },
            app: {
                get: jest.fn().mockReturnValue({
                    Contract: {},
                    Job: {},
                    Profile: {}
                })
            }
        }

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        }
    })

    it("should process the deposit successfully and return 204 status", async () => {
        const executeMock = jest.fn().mockResolvedValue()

        DepositBalanceUseCase.mockImplementation(() => ({
            execute: executeMock
        }))

        await depositBalanceController.handle(mockRequest, mockResponse)

        expect(DepositBalanceUseCase).toHaveBeenCalledWith({
            contractModel: {},
            jobModel: {},
            profileModel: {}
        })

        expect(executeMock).toHaveBeenCalledWith({
            amount: 100,
            fromClientId: 1,
            toClientId: 2
        })

        expect(mockResponse.status).toHaveBeenCalledWith(204)
        expect(mockResponse.send).toHaveBeenCalled()
    })
})