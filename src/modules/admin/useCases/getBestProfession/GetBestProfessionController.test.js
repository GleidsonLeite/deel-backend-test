const { GetBestProfessionController } = require("./GetBestProfessionController");
const { GetBestProfessionUseCase } = require("./GetBestProfessionUseCase");

jest.mock('./GetBestProfessionUseCase')

describe("GetBestProfessionController", () => {
    /**@type {GetBestProfessionController} */
    let getBestProfessionController;
    /**@type {import("express").Request} */
    let mockRequest;
    /**@type {import("express").Response} */
    let mockResponse;
    
    const startDate = new Date()
    const endDate = new Date()

    beforeEach(() => {
        getBestProfessionController = new GetBestProfessionController()

        mockRequest = {
            query: { start: startDate, end: endDate },
            app: {
                get: jest.fn().mockReturnValue({
                    Job: {},
                    Contract: {},
                    Profile: {}
                })
            }
        }

        mockResponse = {
            json: jest.fn().mockReturnThis()
        }
    })

    it("sohuld return the best profession on success", async () => {
        const mockBestProfession = { profession: "Engineer", totalEarned: 1000 }

        const executeMock = jest.fn().mockResolvedValue(mockBestProfession)

        GetBestProfessionUseCase.mockImplementation(() => ({
            execute: executeMock
        }))

        await getBestProfessionController.handle(mockRequest, mockResponse)

        expect(GetBestProfessionUseCase).toHaveBeenCalledWith({
            jobModel: {},
            contractModel: {},
            profileModel: {}
        })

        expect(executeMock).toHaveBeenCalledWith({ startDate, endDate })

        expect(mockResponse.json).toHaveBeenCalledWith(mockBestProfession)
    })
})