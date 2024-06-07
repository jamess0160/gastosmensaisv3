import { BaseUseCase } from "@/base";
import type { prisma } from "@/database/prisma";

export class BanksUseCases extends BaseUseCase {
    getAll() {
        return this.prisma.banks.findMany()
    }

    create(data: CreateBank) {
        return this.prisma.banks.create({ data })
    }

    update(IdBank: number, data: UpdateBank) {
        return this.prisma.banks.update({
            where: { IdBank },
            data: data
        })
    }

    remove(IdBank: number) {
        return this.prisma.banks.delete({
            where: { IdBank }
        })
    }

}

export const banksUseCases = new BanksUseCases()

//#region Interfaces / Types 

type CreateBank = Parameters<typeof prisma.banks.create>[0]['data']

type UpdateBank = Parameters<typeof prisma.banks.update>[0]['data']

//#endregion
