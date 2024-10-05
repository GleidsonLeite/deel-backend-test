const { AppError } = require("../../../shared/error/AppError")
const { GetBestProfessionUseCase } = require("./GetBestProfessionUseCase")

describe('GetBestProfessionUseCase', () => {
    /**@type {GetBestProfessionUseCase} */
    let getBestProfessionUseCase
    let jobModelMock, profileModelMock, contractModelMock

    beforeEach(() => {
        jobModelMock = {
            findOne: jest.fn()
        }
        contractModelMock = {}
        profileModelMock = {}

        getBestProfessionUseCase = new GetBestProfessionUseCase({
            contractModel: contractModelMock,
            profileModel: profileModelMock,
            jobModel: jobModelMock
        })
    })

    it("should return the profession with the highest earnings", async () => {
        const mockResult = {
            profession: 'Engineer',
            totalEarned: 1000
        }

        jobModelMock.findOne.mockResolvedValue(mockResult)

        const startDate = new Date()
        const endDate = new Date()

        const result = await getBestProfessionUseCase.execute({ startDate, endDate })

        expect(result).toEqual(mockResult)
    })

    it("should throw a 404 error when no jobs are found", async () => {
        jobModelMock.findOne.mockResolvedValue(null)

        const startDate = new Date()
        const endDate = new Date()

        try {
            await getBestProfessionUseCase.execute({ startDate, endDate })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('No paid jobs found in the specified date range')
            expect(error.statusCode).toBe(404)
        }
    })
})