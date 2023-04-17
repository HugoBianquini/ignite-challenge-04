import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let statementsRepositoryInMemory: IStatementsRepository
let userRepositoryInMemory: IUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let createStatementUseCase: CreateStatementUseCase


describe("CreateStatementUseCase", () => {

  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    userRepositoryInMemory = new InMemoryUsersRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
  })

  it("should get balance", async () => {

    const user = {
      name: "test",
      password: "test",
      email: "test@email.com"
    }

    const newUser = await userRepositoryInMemory.create(user)

    const statement = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: ""
    })

    const stat = await getStatementOperationUseCase.execute({
      user_id: newUser.id as string,
      statement_id: statement.id as string
    })

    expect(stat).not.toBeNull()
    expect(stat).toMatchObject(statement)
  })

  it("should throw error if user does not exist", async () => {
    expect(async () => await getStatementOperationUseCase.execute({ user_id: "any", statement_id: "any" }))
      .rejects.toEqual(new GetStatementOperationError.UserNotFound())
  })
})