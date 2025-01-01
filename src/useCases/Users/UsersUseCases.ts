import { BaseUseCase } from "@/base/baseUseCase";
import { prisma } from "@/database/prisma";

export class UsersUseCases extends BaseUseCase {

    getById(IdUser: number) {
        return this.prisma.users.findFirst({
            where: { IdUser }
        })
    }

    login(login: string, password: string) {
        return this.prisma.users.findFirst({
            where: {
                Login: login,
                Password: password
            }
        })
    }

    update(IdUser: number, data: UpdateUsers) {
        return this.prisma.users.update({
            where: { IdUser },
            data: data
        })
    }
}

export const usersUseCases = new UsersUseCases()

//#region Interfaces / Types 

type UpdateUsers = Parameters<typeof prisma.users.update>[0]['data']

//#endregion