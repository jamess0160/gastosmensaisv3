import type { prisma } from "@/database/prisma"
import { BaseUseCase } from "../../base/baseUseCase"

export class ExpenseDestinysUseCases extends BaseUseCase {

    getUnique(IdExpenseDestiny: number) {
        return this.prisma.expensedestinys.findFirstOrThrow({ where: { IdExpenseDestiny } })
    }

    create(data: CreateBaseExpense) {
        return this.prisma.expensedestinys.create({ data })
    }

    update(IdExpenseDestiny: number, data: UpdateBaseExpense) {
        return this.prisma.expensedestinys.update({
            where: { IdExpenseDestiny },
            data: data
        })
    }

    delete(IdExpenseDestiny: number) {
        return this.prisma.expensedestinys.delete({
            where: { IdExpenseDestiny }
        })
    }

    deleteExpenseChilds(IdBaseExpense: number) {
        return this.prisma.expensedestinys.deleteMany({
            where: { IdBaseExpense }
        })
    }
}

export const expenseDestinysUseCases = new ExpenseDestinysUseCases()

//#region Interaces / Types

type CreateBaseExpense = Parameters<typeof prisma.expensedestinys.create>[0]['data']

type UpdateBaseExpense = Parameters<typeof prisma.expensedestinys.update>[0]['data']


//#endregion
