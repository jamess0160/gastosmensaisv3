import { BaseUseCase } from "@/base/baseUseCase";
import { prisma } from "@/database/prisma";

export class UsersAuthUseCases extends BaseUseCase {

    async getAll() {
        return this.prisma.usersauth.findMany()
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
}

export const usersAuthUseCases = new UsersAuthUseCases()

//#region Interfaces / Types 

type CreateUsersAuth = Parameters<typeof prisma.usersauth.create>[0]['data']

//#endregion
