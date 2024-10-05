const { profileTypeEnum } = require("../../../profile/enums/ProfileTypeEnum")
const { PayJobController } = require("./PayJobController")
const { PayJobUseCase } = require("./PayJobUseCase")

jest.mock('./PayJobUseCase')

describe("PayJobController", () => {
    /**@type {PayJobController} */
    let payJobController
    /**@type {import("express").Request} */
    let mockRequest
    /**@type {import("express").Response} */
    let mockResponse

    beforeEach(() => {
        payJobController = new PayJobController();

        mockRequest = {
            params: { job_id: 1 },
            profile: { id: 123, type: profileTypeEnum.CLIENT },
            app: {
                get: jest.fn().mockReturnValue({
                    Job: {},
                    Contract: {},
                    Profile: {}
                })
            }
        };

        mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
    })

    it("should return the job when paid successfully", async () => {
        const mockPaidJob = {
            id: 1,
            description: "Test",
            price: 100,
            paid: true
        }

        const executeMock = jest.fn().mockResolvedValue(mockPaidJob)

        PayJobUseCase.mockImplementation(() => ({
            execute: executeMock
        }))

        await payJobController.handle(mockRequest, mockResponse)

        expect(PayJobUseCase).toHaveBeenCalledWith({
            jobModel: {},
            contractModel: {},
            profileModel: {}
        })

        expect(executeMock).toHaveBeenCalledWith({
            jobId: 1,
            clientId: 123
        })

        expect(mockResponse.json).toHaveBeenCalledWith(mockPaidJob)

    })
})