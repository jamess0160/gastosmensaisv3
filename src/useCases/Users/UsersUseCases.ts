import { BaseUseCase } from "@/base/baseUseCase";

export class UsersUseCases extends BaseUseCase {
    login(login: string, password: string) {
        return this.prisma.users.findFirst({
            where: {
                Login: login,
                Password: password
            }
        })
    }
}

export const usersUseCases = new UsersUseCases()