import type { prisma } from "@/database/prisma";
import { BaseUseCase } from "../../base/baseUseCase";

export class DefaultExpensesUseCases extends BaseUseCase {

    getFirstByBaseExpense(IdBaseExpenses: number[]) {
        return this.prisma.defaultexpenses.findFirst({
            where: {
                IdBaseExpense: { in: IdBaseExpenses }
            },
            orderBy: {
                IdDefaultExpense: "desc"
            }
        })
    }

    create(data: CreateDefaultExpenses) {
        return this.prisma.defaultexpenses.create({ data })
    }

    update(IdDefaultExpense: number, data: UpdateDefaultExpenses) {
        return this.prisma.defaultexpenses.update({
            where: { IdDefaultExpense },
            data: data
        })
    }

    delete(IdDefaultExpense: number) {
        return this.prisma.defaultexpenses.delete({
            where: { IdDefaultExpense }
        })
    }

}

export const defaultExpensesUseCases = new DefaultExpensesUseCases()

//#region Interfaces / Types 

type CreateDefaultExpenses = Parameters<typeof prisma.defaultexpenses.create>[0]['data']

type UpdateDefaultExpenses = Parameters<typeof prisma.defaultexpenses.update>[0]['data']

//#endregion
