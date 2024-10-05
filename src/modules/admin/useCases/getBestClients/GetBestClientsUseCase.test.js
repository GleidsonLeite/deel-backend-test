const { col, fn } = require("sequelize")
const { GetBestClientsUseCase } = require("./GetBestClientsUseCase")
const { AppError } = require("../../../shared/error/AppError")

describe('GetBestClientsUseCase', () => {
    /**@type { GetBestClientsUseCase } */
    let getBestClientsUseCase
    let jobsModelMock, contractsModelMock, profilesModelMock

    beforeEach(() => {
        jobsModelMock = { findAll: jest.fn() }
        contractsModelMock = {}
        profilesModelMock = {}

        getBestClientsUseCase = new GetBestClientsUseCase({
            jobsModel: jobsModelMock,
            contractsModel: contractsModelMock,
            profilesModel: profilesModelMock
        })
    })

    it("should return a list of best clients when found", async () => {
        const mockResults = [
            { id: 1, fullName: 'John Doe', paid: 100 },
            { id: 2, fullName: 'Jane Doe', paid: 200 }
        ]

        jobsModelMock.findAll.mockResolvedValue(mockResults)

        const startDate = new Date()
        const endDate = new Date()
        const limit = 2

        const result = await getBestClientsUseCase.execute({ startDate, endDate, limit })

        expect(result).toEqual(mockResults)
    })

    it("should throw a 404 error when no clients are found", async () => {
        jobsModelMock.findAll.mockResolvedValue([])

        const startDate = new Date()
        const endDate = new Date()
        const limit = 2

        try {
            await getBestClientsUseCase.execute({ startDate, endDate, limit })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('No paid jobs found in the specified date range')
            expect(error.statusCode).toBe(404)
        }
    })
})