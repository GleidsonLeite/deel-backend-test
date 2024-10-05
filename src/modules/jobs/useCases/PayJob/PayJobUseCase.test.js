const { sequelize } = require("../../../../model")
const { AppError } = require("../../../shared/error/AppError")
const { PayJobUseCase } = require("./PayJobUseCase")

jest.mock("../../../../model", () => ({
    sequelize: {
        transaction: jest.fn()
    }
}))

describe('PayJobUseCase', () => {
    /**@type {PayJobUseCase} */
    let payJobUseCase
    let jobModelMock, contractModelMock, profileModelMock

    beforeEach(() => {
        jobModelMock = {
            findOne: jest.fn()
        }
        contractModelMock = {}
        profileModelMock = {}

        payJobUseCase = new PayJobUseCase({
            jobModel: jobModelMock,
            contractModel: contractModelMock,
            profileModel: profileModelMock
        })
    })

    it("should successfully process the payment for a job", async () => {
        const clientId = 1;
        const jobId = 10;
        const foundJob = {
            id: jobId,
            description: 'Job description',
            price: 100,
            paid: false,
            Contract: {
                ClientId: clientId,
                Client: {
                    id: clientId,
                    balance: 200,
                    decrement: jest.fn()
                },
                Contractor: {
                    id: 2,
                    increment: jest.fn()
                }
            },
            save: jest.fn(),
            paymentDate: null
        }

        jobModelMock.findOne.mockResolvedValue(foundJob)

        sequelize.transaction.mockImplementation(async (_options, transactionCallback) => {
            await transactionCallback()
        })

        const result = await payJobUseCase.execute({ clientId, jobId })

        expect(foundJob.Contract.Client.decrement).toHaveBeenCalledWith('balance', { by: foundJob.price, transaction: undefined })
        expect(foundJob.Contract.Contractor.increment).toHaveBeenCalledWith('balance', { by: foundJob.price, transaction: undefined })

        expect(foundJob.save).toHaveBeenCalled()
    })

    it("should throw an error if the job is not found", async () => {
        const clientId = 1;
        const jobId = 10;

        jobModelMock.findOne.mockResolvedValue(null)

        try {
            await payJobUseCase.execute({ clientId, jobId })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Job not found')
            expect(error.statusCode).toBe(404)
        }
    })

    it("should throw an error if the client is not authorized to pay for the job", async () => {
        const clientId = 1;
        const jobId = 10;
        const foundJob = {
            id: jobId,
            description: 'Job description',
            price: 100,
            paid: false,
            Contract: {
                ClientId: 2
            }
        }

        jobModelMock.findOne.mockResolvedValue(foundJob)

        try {
            await payJobUseCase.execute({ clientId, jobId })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('You are anot authorized to pay for this job')
            expect(error.statusCode).toBe(403)
        }
    })

    it("should throw an error if the job has already been paid", async () => {
        const clientId = 1;
        const jobId = 10;
        const foundJob = {
            id: jobId,
            description: 'Job description',
            price: 100,
            paid: true,
            Contract: {
                ClientId: clientId
            }
        }

        jobModelMock.findOne.mockResolvedValue(foundJob)

        try {
            await payJobUseCase.execute({ clientId, jobId })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Job has already been paid')
            expect(error.statusCode).toBe(400)
        }
    })

    it("should throw an error if the client has insufficient balance", async () => {
        const clientId = 1;
        const jobId = 10;
        const foundJob = {
            id: jobId,
            description: 'Job description',
            price: 100,
            paid: false,
            Contract: {
                ClientId: clientId,
                Client: {
                    id: clientId,
                    balance: 50
                }
            }
        }

        jobModelMock.findOne.mockResolvedValue(foundJob)

        try {
            await payJobUseCase.execute({ clientId, jobId })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Insufficient balance')
            expect(error.statusCode).toBe(400)
        }
    })
})