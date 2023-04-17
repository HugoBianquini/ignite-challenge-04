import { IUsersRepository } from "../../repositories/IUsersRepository"
import { UsersRepository } from "../../repositories/UsersRepository"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"

let userRepositoryInMemory: IUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe("AuthenticateUserUseCase", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })

  it("should authenticate user", async () => {

    const user = {
      name: "test",
      password: "test",
      email: "test@email.com"
    }

    await createUserUseCase.execute(user)

    const authenticatedUser = await authenticateUserUseCase.execute({ email: user.email, password: user.password })

    expect(authenticatedUser).not.toBeNull()
    expect(authenticatedUser).toHaveProperty("token")
  })

  it("should throw error if password is wrong", async () => {

    const user = {
      name: "test",
      password: "test",
      email: "test@email.com"
    }

    await createUserUseCase.execute(user)

    expect(async () => await authenticateUserUseCase.execute({ email: user.email, password: "any" }))
      .rejects.toEqual(new IncorrectEmailOrPasswordError())
  })
})