import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let statementsRepositoryInMemory: IStatementsRepository
let userRepositoryInMemory: IUsersRepository
let createStatementUseCase: CreateStatementUseCase

describe("CreateStatementUseCase", () => {

  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    userRepositoryInMemory = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
  })

  it("should create statement", async () => {

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

    expect(statement).not.toBeNull()
    expect(statement).toHaveProperty("id")
  })

  it("should throw error if user does not exist", async () => {

    const stat = {
      user_id: "any",
      type: OperationType.DEPOSIT,
      amount: 100,
      description: ""
    }
    expect(async () => await createStatementUseCase.execute(stat))
      .rejects.toEqual(new CreateStatementError.UserNotFound())
  })
})