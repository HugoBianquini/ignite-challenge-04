import { IUsersRepository } from "../../repositories/IUsersRepository"
import { UsersRepository } from "../../repositories/UsersRepository"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let userRepositoryInMemory: IUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe("ShowUserProfileUseCase", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
  })

  it("should find user", async () => {
    const user = await userRepositoryInMemory.create({
      name: "test",
      password: "test",
      email: "test@email.com"
    })

    expect(await showUserProfileUseCase.execute(user.id!)).toMatchObject({
      name: "test",
      password: "test",
      email: "test@email.com"
    })
  })

  it("should throw error for nonexisting user", async () => {

    expect(async () => await showUserProfileUseCase.execute("any"))
      .rejects.toEqual(new ShowUserProfileError())
  })
})