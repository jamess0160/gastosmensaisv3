import { prisma } from '@/database/prisma'
import { cashinflows, destinys } from '@prisma/client'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from '../../base'
import { utilsUseCases } from '../Utils/UtilsUseCases'
import { cashInflowsUseCases } from '../CashInflows/CashInflowsUseCases'
import { destinysUseCases } from '../Destinys/DestinysUseCases'
import { getParamReturn, sistemParamsUseCases } from '../SistemParams/SistemParamsUseCases'

export class GetMonthlyDestinyResume extends BaseSection<BaseExpensesUseCases> {

    async run(month: number, year: number) {
        let { cashInflows, destinys, params } = await utilsUseCases.resolvePromiseObj({
            cashInflows: cashInflowsUseCases.getAllByMY(month, year),
            destinys: destinysUseCases.getAll(),
            params: sistemParamsUseCases.getAll(month, year),
        })

        destinys = destinys.filter((item) => item.IdDestiny !== parseInt(params.IdDestinoConjunto))

        let jointExpenses = await this.calculateJointExpenses(month, year, parseInt(params.IdDestinoConjunto), destinys)

        return Promise.all(destinys.map<Promise<DestinyResume>>((item) => this.generateDestinyResume(item, cashInflows, destinys.length, params, month, year, jointExpenses)))
    }

    private async calculateJointExpenses(month: number, year: number, IdDestinoConjunto: number, destinys: destinys[]) {
        let jointExpenses = await this.getDestinyExpenses(month, year, IdDestinoConjunto)
        let fullJointExpenses = await this.instance.GenerateFullBaseExpenseChild.run(jointExpenses)
        let totalJointExpenses = fullJointExpenses.reduce((old, item) => old + utilsUseCases.GetExpensePrice(item), 0)

        let whoSplitJointExpense = destinys.filter((item) => item.SplitJointExpense)

        return totalJointExpenses / whoSplitJointExpense.length
    }

    private async generateDestinyResume(item: destinys, cashInflows: cashinflows[], destinysCount: number, params: getParamReturn, month: number, year: number, jointExpenses: number) {

        let destinyBudget = this.calculateDestinyBudget(cashInflows, item, destinysCount)

        if (item.IdDestiny === parseInt(params.IdDestinoGeral)) {
            destinyBudget = destinyBudget > parseFloat(params.ValorMaximoGeral) ? parseFloat(params.ValorMaximoGeral) : destinyBudget
        }

        let destinyExpenses = await this.getDestinyExpenses(month, year, item.IdDestiny)

        let fullDestinyExpenses = await this.instance.GenerateFullBaseExpenseChild.run(destinyExpenses)

        let totalExpenses = fullDestinyExpenses.reduce((old, item) => old + utilsUseCases.GetExpensePrice(item), 0)

        if (item.SplitJointExpense) {
            totalExpenses += jointExpenses
        }

        return {
            DestinyData: item,
            RemainingBudget: destinyBudget - totalExpenses
        }
    }

    private getDestinyExpenses(month: number, year: number, IdDestiny: number) {
        return prisma.baseexpenses.findMany({
            where: {
                EntryDate: {
                    gte: utilsUseCases.monthAndYearToMoment(month, year).toDate(),
                    lt: utilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
                },
                IdDestiny: IdDestiny,
            }
        })
    }

    private calculateDestinyBudget(cashInflows: cashinflows[], destiny: destinys, totalDestinys: number) {
        let commonCash = cashInflows.reduce((old, item) => {
            return old + (item.IdDestiny ? 0 : item.Value)
        }, 0) / totalDestinys

        let destinyCash = cashInflows.reduce((old, item) => {
            return old + (item.IdDestiny === destiny.IdDestiny ? item.Value : 0)
        }, 0)

        return commonCash + destinyCash
    }
}

//#region Interfaces / Types 

export interface DestinyResume {
    DestinyData: destinys
    RemainingBudget: number
}

//#endregion