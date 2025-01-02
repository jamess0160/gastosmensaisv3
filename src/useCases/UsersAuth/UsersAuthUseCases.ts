import { BaseUseCase } from "@/base/baseUseCase";
import { prisma } from "@/database/prisma";

export class UsersAuthUseCases extends BaseUseCase {

    async getAll() {
        return this.prisma.usersauth.findMany()
    }

    async getByToken(Token: string) {
        return this.prisma.usersauth.findFirst({
            where: { Token },
            orderBy: { IdUserAuth: "desc" }
        })
    }

    async getByUser(IdUser: number) {
        return this.prisma.usersauth.findMany({
            where: { IdUser },
            orderBy: { IdUserAuth: "desc" }
        })
    }

    async create(data: CreateUsersAuth) {
        let currentAuth = await this.prisma.usersauth.findMany({
            where: { Token: data.Token }
        })

        if (currentAuth.length !== 0) {
            return
        }

        return this.prisma.usersauth.create({ data })
    }

    update(IdUserAuth: number, data: UpdateUsersAuth) {
        return this.prisma.usersauth.update({
            where: { IdUserAuth },
            data: data
        })
    }
}

export const usersAuthUseCases = new UsersAuthUseCases()

//#region Interfaces / Types 

type CreateUsersAuth = Parameters<typeof prisma.usersauth.create>[0]['data']

type UpdateUsersAuth = Parameters<typeof prisma.usersauth.update>[0]['data']

//#endregion
