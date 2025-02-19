import type { prisma } from "@/database/prisma"
import { BaseUseCase } from "../../base/baseUseCase"
import { GenerateFullBaseExpenseChild } from "./generateFullBaseExpenseChild"
import { GetMonthlyBanksResume } from "./getMonthlyBanksResume"
import { GetMonthlyDestinyResume } from "./getMonthlyDestinyResume"
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { GetReports } from "./getReports"
import { Prisma } from "@prisma/client"

export class BaseExpensesUseCases extends BaseUseCase {

    readonly GenerateFullBaseExpenseChild = new GenerateFullBaseExpenseChild(this)
    readonly GetMonthlyBanksResume = new GetMonthlyBanksResume(this)
    readonly GetMonthlyDestinyResume = new GetMonthlyDestinyResume(this)
    readonly GetReports = new GetReports(this)

    getUnique(IdBaseExpense: number) {
        return this.prisma.baseexpenses.findFirstOrThrow({ where: { IdBaseExpense } })
    }

    async GetMonthlySum(month: number, year: number, IdUser: number) {
        let baseExpenses = await this.GenerateFullBaseExpenseChild.run(month, year, IdUser)
        return baseExpenses.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item, { sumInactive: true, split: false }), 0)
    }

    GetMonthlyBankCategory(month: number, year: number, IdUser: number, IdBank: number, IdExpenseCategory?: number) {
        return this.GenerateFullBaseExpenseChild.run(month, year, IdUser, { IdBank, IdExpenseCategory })
    }

    getAllFromDestiny(IdDestiny: number) {
        return this.prisma.baseexpenses.findMany({
            where: {
                expensedestinys: {
                    some: { IdDestiny }
                }
            }
        })
    }

    getAllWhere(where: Prisma.baseexpensesWhereInput) {
        return this.prisma.baseexpenses.findMany({ where })
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

    updateMany(IdsBaseExpenses: number[], data: UpdateBaseExpense) {
        return this.prisma.baseexpenses.updateMany({
            where: {
                IdBaseExpense: {
                    in: IdsBaseExpenses
                }
            },
            data: data
        })
    }

    delete(IdBaseExpense: number) {
        return this.prisma.baseexpenses.delete({
            where: { IdBaseExpense }
        })
    }

    deleteMany(IdsBaseExpenses: number[]) {
        return this.prisma.baseexpenses.deleteMany({
            where: {
                IdBaseExpense: {
                    in: IdsBaseExpenses
                }
            }
        })
    }

    deleteChilds(IdBaseExpense: number) {
        return Promise.all([
            this.prisma.defaultexpenses.deleteMany({ where: { IdBaseExpense } }),
            this.prisma.fixedexpenses.deleteMany({ where: { IdBaseExpense } }),
            this.prisma.installmentexpenses.deleteMany({ where: { IdBaseExpense } }),
            this.prisma.nfeexpenses.deleteMany({ where: { IdBaseExpense } }),
        ])
    }
}

export const baseExpensesUseCases = new BaseExpensesUseCases()

//#region Interaces / Types

type CreateBaseExpense = Parameters<typeof prisma.baseexpenses.create>[0]['data']

type UpdateBaseExpense = Parameters<typeof prisma.baseexpenses.update>[0]['data']


//#endregion
