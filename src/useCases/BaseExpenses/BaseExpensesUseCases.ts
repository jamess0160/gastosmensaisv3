import type { prisma } from "@/database/prisma"
import { BaseUseCase } from "../../base"
import { GenerateFullBaseExpenseChild } from "./generateFullBaseExpenseChild"
import { GetMonthlyBankCategory } from "./getMonthlyBankCategory"
import { GetMonthlyBanksResume } from "./getMonthlyBanksResume"
import { GetMonthlyDestinyCategory } from "./getMonthlyDestinyCategory"
import { GetMonthlyDestinyResume } from "./getMonthlyDestinyResume"
import { GetMonthlySum } from "./getMonthlySum"

export class BaseExpensesUseCases extends BaseUseCase {

    readonly GenerateFullBaseExpenseChild = new GenerateFullBaseExpenseChild(this)
    readonly GetMonthlyBankCategory = new GetMonthlyBankCategory(this)
    readonly GetMonthlyBanksResume = new GetMonthlyBanksResume(this)
    readonly GetMonthlyDestinyCategory = new GetMonthlyDestinyCategory(this)
    readonly GetMonthlyDestinyResume = new GetMonthlyDestinyResume(this)
    readonly GetMonthlySum = new GetMonthlySum(this)

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
}

export const baseExpensesUseCases = new BaseExpensesUseCases()

//#region Interaces / Types

type CreateBaseExpense = Parameters<typeof prisma.baseexpenses.create>[0]['data']

type UpdateBaseExpense = Parameters<typeof prisma.baseexpenses.update>[0]['data']


//#endregion
