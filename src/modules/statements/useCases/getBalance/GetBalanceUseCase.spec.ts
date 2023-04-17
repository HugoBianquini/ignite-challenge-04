import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let statementsRepositoryInMemory: IStatementsRepository
let userRepositoryInMemory: IUsersRepository
let getBalanceUseCase: GetBalanceUseCase
let createStatementUseCase: CreateStatementUseCase


describe("CreateStatementUseCase", () => {

  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    userRepositoryInMemory = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, userRepositoryInMemory)
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
  })

  it("should get balance", async () => {

    const user = {
      name: "test",
      password: "test",
      email: "test@email.com"
    }

    const newUser = await userRepositoryInMemory.create(user)

    await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: ""
    })

    const balance = await getBalanceUseCase.execute({ user_id: newUser.id as string })

    expect(balance).not.toBeNull()
    expect(balance.statement).toHaveLength(1)
    expect(balance.balance).toEqual(100)
  })

  it("should throw error if user does not exist", async () => {
    expect(async () => await getBalanceUseCase.execute({ user_id: "any" }))
      .rejects.toEqual(new GetBalanceError())
  })
})