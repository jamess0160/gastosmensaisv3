import type { prisma } from "@/database/prisma"
import { BaseUseCase } from "../../base/baseUseCase"
import { GenerateFullBaseExpenseChild } from "./generateFullBaseExpenseChild"
import { GetMonthlyBanksResume } from "./getMonthlyBanksResume"
import { GetMonthlyDestinyResume } from "./getMonthlyDestinyResume"
import { UtilTypes } from "@/database/UtilTypes"
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases"

export class BaseExpensesUseCases extends BaseUseCase {

    readonly GenerateFullBaseExpenseChild = new GenerateFullBaseExpenseChild(this)
    readonly GetMonthlyBanksResume = new GetMonthlyBanksResume(this)
    readonly GetMonthlyDestinyResume = new GetMonthlyDestinyResume(this)

    getUnique(IdBaseExpense: number) {
        return this.prisma.baseexpenses.findFirstOrThrow({ where: { IdBaseExpense } })
    }

    async GetMonthlySum(month: number, year: number) {
        let baseExpenses = await this.GenerateFullBaseExpenseChild.run(month, year)
        return baseExpenses.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item), 0)
    }

    GetMonthlyBankCategory(month: number, year: number, IdBank: number, IdExpenseCategory?: number) {
        return this.GenerateFullBaseExpenseChild.run(month, year, { IdBank, IdExpenseCategory })
    }

    GetMonthlyDestinyCategory(month: number, year: number, IdDestiny: number, IdExpenseCategory: number) {
        return this.GenerateFullBaseExpenseChild.run(month, year, { IdDestiny, IdExpenseCategory })
    }

    create(data: CreateBaseExpense) {
        return this.prisma.baseexpenses.create({ data })
    }

    update(IdBaseExpense: number, data: UpdateBaseExpense) {
        return this.prisma.baseexpenses.update({
            where: { IdBaseExpense },
            data: data
        })
    }

    delete(IdBaseExpense: number) {
        return this.prisma.baseexpenses.delete({
            where: { IdBaseExpense }
        })
    }

    deleteChilds(tx: UtilTypes.PrismaTransaction, IdBaseExpense: number) {
        return Promise.all([
            tx.defaultexpenses.deleteMany({ where: { IdBaseExpense } }),
            tx.fixedexpenses.deleteMany({ where: { IdBaseExpense } }),
            tx.installmentexpenses.deleteMany({ where: { IdBaseExpense } }),
        ])
    }
}

export const baseExpensesUseCases = new BaseExpensesUseCases()

//#region Interaces / Types

type CreateBaseExpense = Parameters<typeof prisma.baseexpenses.create>[0]['data']

type UpdateBaseExpense = Parameters<typeof prisma.baseexpenses.update>[0]['data']


//#endregion
