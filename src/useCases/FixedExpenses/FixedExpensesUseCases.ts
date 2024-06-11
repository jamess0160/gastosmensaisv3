import type { prisma } from "@/database/prisma";
import { BaseUseCase } from "../../base/baseUseCase";

export class FixedExpensesUseCases extends BaseUseCase {

    getFirstByBaseExpense(IdBaseExpenses: number[]) {
        return this.prisma.fixedexpenses.findFirst({
            where: {
                IdBaseExpense: { in: IdBaseExpenses }
            },
            orderBy: {
                IdFixedExpense: "desc"
            }
        })
    }

    create(data: CreateFixedExpenses) {
        return this.prisma.fixedexpenses.create({
            data: data
        })
    }

    update(IdFixedExpense: number, data: UpdateFixedExpenses) {
        return this.prisma.fixedexpenses.update({
            where: { IdFixedExpense },
            data: data
        })
    }

    remove(IdFixedExpense: number) {
        return this.prisma.fixedexpenses.delete({
            where: { IdFixedExpense }
        })
    }
}

export const fixedExpensesUseCases = new FixedExpensesUseCases()

//#region Interfaces / Types 

type CreateFixedExpenses = Parameters<typeof prisma.fixedexpenses.create>[0]['data']

type UpdateFixedExpenses = Parameters<typeof prisma.fixedexpenses.update>[0]['data']

//#endregion