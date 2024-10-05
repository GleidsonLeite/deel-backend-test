const { sequelize } = require("../../../../model")
const { AppError } = require("../../../shared/error/AppError")
const { DepositBalanceUseCase } = require("./DepositBalanceUseCase")

jest.mock("../../../../model", () => ({
    sequelize: {
        transaction: jest.fn()
    }
}))

describe('DepositBalanceUseCase', () => {
    /**@type {DepositBalanceUseCase} */
    let depositBalanceUseCase
    let profileModelMock, jobModelMock, contractModelMock

    beforeEach(() => {
        profileModelMock = {
            findOne: jest.fn()
        }
        jobModelMock = {
            sum: jest.fn()
        }
        contractModelMock = {}

        depositBalanceUseCase = new DepositBalanceUseCase({
            profileModel: profileModelMock,
            jobModel: jobModelMock,
            contractModel: contractModelMock
        })
    })

    it("should process the deposit successfully", async () => {
        const fromClientId = 1
        const toClientId = 2
        const amount = 100

        const fromClient = {
            id: fromClientId,
            balance: 500,
            decrement: jest.fn()
        }

        const toClient = {
            id: toClientId,
            balance: 200,
            increment: jest.fn()
        }

        profileModelMock.findOne
            .mockResolvedValueOnce(fromClient)
            .mockResolvedValueOnce(toClient)
        
        jobModelMock.sum.mockResolvedValue(400)

        sequelize.transaction.mockImplementation(async (_options, transactionCallback) => {
            await transactionCallback()
        })

        await depositBalanceUseCase.execute({ amount, fromClientId, toClientId })

        expect(fromClient.decrement).toHaveBeenCalledWith('balance', { by: amount, transaction: undefined })
        expect(toClient.increment).toHaveBeenCalledWith('balance', { by: amount, transaction: undefined })
    })

    it("should throw an error if fromClientId and toClientId are the same", async () => {
        const fromClientId = 1
        const toClientId = 1
        const amount = 100

        try {
            await depositBalanceUseCase.execute({ amount, fromClientId, toClientId })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Cannot deposit to the same client')
            expect(error.statusCode).toBe(400)
        }
    })

    it("should throw an error if the sender client is not found", async () => {
        const fromClientId = 1
        const toClientId = 2
        const amount = 100

        profileModelMock.findOne.mockResolvedValue(null)

        try {
            await depositBalanceUseCase.execute({ amount, fromClientId, toClientId })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Sender Client not found')
            expect(error.statusCode).toBe(404)
        }
    })

    it ("should throw an error if the recipient client is not found", async () => {
        const fromClientId = 1
        const toClientId = 2
        const amount = 100

        profileModelMock.findOne
            .mockResolvedValueOnce({ id: fromClientId })
            .mockResolvedValueOnce(null)

        try {
            await depositBalanceUseCase.execute({ amount, fromClientId, toClientId })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Recipient Client not found')
            expect(error.statusCode).toBe(404)
        }
    })

    it('should throw an error if the sender has insufficient balance', async () => {
        const fromClientId = 1;
        const toClientId = 2;
        const amount = 500;

        const fromClient = { id: fromClientId, balance: 300 };

        profileModelMock.findOne
            .mockResolvedValueOnce(fromClient)
            .mockResolvedValueOnce({ id: toClientId, balance: 200 });

        try {
            await depositBalanceUseCase.execute({ amount, fromClientId, toClientId });
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Insufficient balance');
            expect(error.statusCode).toBe(400);
        }
    });

    it ("should throw an error if the deposit exceeds 25% of total jobs to pay", async () => {
        const fromClientId = 1
        const toClientId = 2
        const amount = 200

        const fromClient = { id: fromClientId, balance: 500 }
        const toClient = { id: toClientId, balance: 200 }

        profileModelMock.findOne
            .mockResolvedValueOnce(fromClient)
            .mockResolvedValueOnce(toClient)

        jobModelMock.sum.mockResolvedValue(400)

        try {
            await depositBalanceUseCase.execute({ amount, fromClientId, toClientId })
        } catch (error) {
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Deposit amounts exceeds 25% of total jobs to pay. Maximum Allowed: 100')
            expect(error.statusCode).toBe(400)
        }
    })
})