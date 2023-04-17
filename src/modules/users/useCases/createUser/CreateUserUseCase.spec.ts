import { IUsersRepository } from "../../repositories/IUsersRepository"
import { UsersRepository } from "../../repositories/UsersRepository"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let userRepositoryInMemory: IUsersRepository
let createUserUseCase: CreateUserUseCase

describe("CreateUserUseCase", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })

  it("should create user", async () => {

    const newUser = await createUserUseCase.execute({
      name: "test",
      password: "test",
      email: "test@email.com"
    })

    expect(newUser).toHaveProperty('id')
  })

  it("should throw error if user already exists", async () => {

    const user = {
      name: "test",
      password: "test",
      email: "test@email.com"
    }

    await userRepositoryInMemory.create(user)

    expect(async () => await createUserUseCase.execute(user))
      .rejects.toEqual(new CreateUserError())
  })
})