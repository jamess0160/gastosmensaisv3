import type { prisma } from "@/database/prisma"
import { BaseUseCase } from "../../base/baseUseCase"
import { GenerateFullBaseExpenseChild } from "./generateFullBaseExpenseChild"
import { GetMonthlyBanksResume } from "./getMonthlyBanksResume"
import { GetMonthlyDestinyResume } from "./getMonthlyDestinyResume"
import { UtilTypes } from "@/database/UtilTypes"
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases"
import { GetMonthlyDestinyCategory } from "./GetMonthlyDestinyCategory"
import { GetReports } from "./getReports"

export class BaseExpensesUseCases extends BaseUseCase {

    readonly GenerateFullBaseExpenseChild = new GenerateFullBaseExpenseChild(this)
    readonly GetMonthlyBanksResume = new GetMonthlyBanksResume(this)
    readonly GetMonthlyDestinyResume = new GetMonthlyDestinyResume(this)
    readonly GetMonthlyDestinyCategory = new GetMonthlyDestinyCategory(this)
    readonly GetReports = new GetReports(this)

    getUnique(IdBaseExpense: number) {
        return this.prisma.baseexpenses.findFirstOrThrow({ where: { IdBaseExpense } })
    }

    async GetMonthlySum(month: number, year: number, IdUser: number) {
        let baseExpenses = await this.GenerateFullBaseExpenseChild.run(month, year, IdUser)
        return baseExpenses.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item), 0)
    }

    GetMonthlyBankCategory(month: number, year: number, IdUser: number, IdBank: number, IdExpenseCategory?: number) {
        return this.GenerateFullBaseExpenseChild.run(month, year, IdUser, { IdBank, IdExpenseCategory })
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
