import type { prisma } from "@/database/prisma";
import { BaseUseCase } from "../../base/baseUseCase";
import { CreateNfeExpenses } from "./createNfeExpense/createNfeExpense";

export class NfeExpensesUseCases extends BaseUseCase {

    public readonly CreateNfeExpenses = new CreateNfeExpenses(this)

    getFirstByBaseExpense(IdBaseExpenses: number[]) {
        return this.prisma.nfeexpenses.findFirst({
            where: {
                IdBaseExpense: { in: IdBaseExpenses }
            },
            orderBy: {
                IdNfeExpense: "desc"
            }
        })
    }

    create(data: TCreateNfeExpenses) {
        return this.prisma.nfeexpenses.create({ data })
    }

    update(IdNfeExpense: number, data: TUpdateNfeExpenses) {
        return this.prisma.nfeexpenses.update({
            where: { IdNfeExpense },
            data: data
        })
    }

    delete(IdNfeExpense: number) {
        return this.prisma.nfeexpenses.delete({
            where: { IdNfeExpense }
        })
    }

}

export const nfeExpensesUseCases = new NfeExpensesUseCases()

//#region Interfaces / Types 

type TCreateNfeExpenses = Parameters<typeof prisma.nfeexpenses.create>[0]['data']

type TUpdateNfeExpenses = Parameters<typeof prisma.nfeexpenses.update>[0]['data']

//#endregion
