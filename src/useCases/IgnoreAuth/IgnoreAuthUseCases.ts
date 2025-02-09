import { BaseUseCase } from "@/base/baseUseCase";
import { prisma } from "@/database/prisma";

export class IgnoreAuthUseCases extends BaseUseCase {

    getAll() {
        return this.prisma.ignoreauth.findMany()
    }

    getByUser(IdUser: number) {
        return this.prisma.ignoreauth.findMany({
            where: { IdUser },
            orderBy: { IdIgnoreAuth: "desc" }
        })
    }

    create(data: CreateIgnoreAuth) {
        return this.prisma.ignoreauth.create({ data })
    }

    update(IdIgnoreAuth: number, data: UpdateIgnoreAuth) {
        return this.prisma.ignoreauth.update({
            where: { IdIgnoreAuth },
            data: data
        })
    }
}

export const ignoreAuthUseCases = new IgnoreAuthUseCases()

//#region Interfaces / Types 

type CreateIgnoreAuth = Parameters<typeof prisma.ignoreauth.create>[0]['data']

type UpdateIgnoreAuth = Parameters<typeof prisma.ignoreauth.update>[0]['data']

//#endregion
