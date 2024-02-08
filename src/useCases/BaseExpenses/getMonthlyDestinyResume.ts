import { prisma } from '@/database/prisma'
import { CashInflowsUseCases } from '../CashInflows/CashInflowsUseCases'
import { DestinysUseCases } from '../Destinys/DestinysUseCases'
import { UtilsUseCases } from '../Utils/UtilsUseCases'
import { SistemParamsUseCases } from '../SistemParams/SistemParamsUseCases'
import { cashinflows, destinys } from '@prisma/client'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'

export async function getMonthlyDestinyResume(month: number, year: number) {
    let { cashInflows, destinys, params } = await UtilsUseCases.resolvePromiseObj({
        cashInflows: CashInflowsUseCases.getAllByMY(month, year),
        destinys: DestinysUseCases.getAll(),
        params: SistemParamsUseCases.getAll(UtilsUseCases.monthAndYearToMoment(month, year).toDate()),
    })

    destinys = destinys.filter((item) => item.IdDestiny !== parseInt(params.IdDestinoConjunto))

    let jointExpenses = await calculateJointExpenses(month, year, parseInt(params.IdDestinoConjunto), destinys)

    return Promise.all(destinys.map<Promise<DestinyResume>>(async (item) => {

        let destinyBudget = calculateDestinyBudget(cashInflows, item, destinys.length)

        if (item.IdDestiny === parseInt(params.IdDestinoGeral)) {
            destinyBudget = destinyBudget > parseFloat(params.ValorMaximoGeral) ? parseFloat(params.ValorMaximoGeral) : destinyBudget
        }

        let destinyExpenses = await getDestinyExpenses(month, year, item.IdDestiny)

        let fullDestinyExpenses = await BaseExpensesUseCases.generateFullBaseExpenseChild(destinyExpenses)

        let totalExpenses = fullDestinyExpenses.reduce((old, item) => old + UtilsUseCases.getExpensePrice(item), 0)

        if (item.SplitJointExpense) {
            totalExpenses += jointExpenses
        }

        return {
            DestinyData: item,
            RemainingBudget: destinyBudget - totalExpenses
        }
    }))
}

function getDestinyExpenses(month: number, year: number, IdDestiny: number) {
    return prisma.baseexpenses.findMany({
        where: {
            EntryDate: {
                gte: UtilsUseCases.monthAndYearToMoment(month, year).toDate(),
                lte: UtilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
            },
            IdDestiny: IdDestiny,
        }
    })
}

async function calculateJointExpenses(month: number, year: number, IdDestinoConjunto: number, destinys: destinys[]) {
    let jointExpenses = await getDestinyExpenses(month, year, IdDestinoConjunto)
    let fullJointExpenses = await BaseExpensesUseCases.generateFullBaseExpenseChild(jointExpenses)
    let totalJointExpenses = fullJointExpenses.reduce((old, item) => old + UtilsUseCases.getExpensePrice(item), 0)

    let whoSplitJointExpense = destinys.filter((item) => item.SplitJointExpense)

    return totalJointExpenses / whoSplitJointExpense.length
}

function calculateDestinyBudget(cashInflows: cashinflows[], destiny: destinys, totalDestinys: number) {
    let commonCash = cashInflows.reduce((old, item) => {
        return old + (item.IdDestiny ? 0 : item.Value)
    }, 0) / totalDestinys

    let destinyCash = cashInflows.reduce((old, item) => {
        return old + (item.IdDestiny === destiny.IdDestiny ? item.Value : 0)
    }, 0)

    return commonCash + destinyCash
}

export interface DestinyResume {
    DestinyData: destinys
    RemainingBudget: number
}