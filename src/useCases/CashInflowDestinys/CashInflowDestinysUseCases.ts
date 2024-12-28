import type { prisma } from "@/database/prisma"
import { BaseUseCase } from "../../base/baseUseCase"

export class CashInflowDestinysUseCases extends BaseUseCase {

    getUnique(IdExpenseDestiny: number) {
        return this.prisma.cashinflowdestinys.findFirstOrThrow({ where: { IdExpenseDestiny } })
    }

    create(data: CreateBaseExpense) {
        return this.prisma.cashinflowdestinys.create({ data })
    }

    update(IdExpenseDestiny: number, data: UpdateBaseExpense) {
        return this.prisma.cashinflowdestinys.update({
            where: { IdExpenseDestiny },
            data: data
        })
    }

    delete(IdExpenseDestiny: number) {
        return this.prisma.cashinflowdestinys.delete({
            where: { IdExpenseDestiny }
        })
    }

    deleteExpenseChilds(IdCashInflow: number) {
        return this.prisma.cashinflowdestinys.deleteMany({
            where: { IdCashInflow }
        })
    }
}

export const cashInflowDestinysUseCases = new CashInflowDestinysUseCases()

//#region Interaces / Types

type CreateBaseExpense = Parameters<typeof prisma.cashinflowdestinys.create>[0]['data']

type UpdateBaseExpense = Parameters<typeof prisma.cashinflowdestinys.update>[0]['data']


//#endregion
