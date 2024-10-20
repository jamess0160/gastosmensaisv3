import { cashinflows, destinys } from '@prisma/client'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from "@/base/baseSection";
import { clientUtilsUseCases } from '../Utils/ClientUtilsUseCases'
import { cashInflowsUseCases } from '../CashInflows/CashInflowsUseCases'
import { destinysUseCases } from '../Destinys/DestinysUseCases'
import { getParamReturn, sistemParamsUseCases } from '../SistemParams/SistemParamsUseCases'

export class GetMonthlyDestinyResume extends BaseSection<BaseExpensesUseCases> {

    async run(month: number, year: number, IdUser: number) {
        let data = await clientUtilsUseCases.resolvePromiseObj({
            cashInflows: cashInflowsUseCases.getAllByMY(month, year, IdUser),
            destinys: destinysUseCases.getAllByUser(IdUser),
            params: sistemParamsUseCases.getAll(month, year, IdUser),
        })

        data.destinys = data.destinys.filter((item) => item.IdDestiny !== parseInt(data.params.IdDestinoConjunto))

        let jointExpenses = data.params.IdDestinoConjunto ? await this.calculateJointExpenses(month, year, IdUser, parseInt(data.params.IdDestinoConjunto), data.destinys) : 0

        return this.generateDestinyResume(month, year, IdUser, data, jointExpenses)
    }

    private async calculateJointExpenses(month: number, year: number, IdUser: number, IdDestinoConjunto: number, destinys: destinys[]) {
        let fullJointExpenses = await this.instance.GenerateFullBaseExpenseChild.run(month, year, IdUser, { IdDestiny: IdDestinoConjunto })
        let totalJointExpenses = fullJointExpenses.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item, { sumInactive: true }), 0)

        let whoSplitJointExpense = destinys.filter((item) => item.SplitJointExpense)

        return totalJointExpenses / whoSplitJointExpense.length
    }

    private generateDestinyResume(month: number, year: number, IdUser: number, data: DestinyResumeData, jointExpenses: number): Promise<DestinyResume[]> {
        let ValorMaximoGeral = parseFloat(data.params.ValorMaximoGeral)
        let IdDestinoGeral = parseFloat(data.params.IdDestinoGeral)

        let destinysBudget = data.destinys.map((item) => this.calculateDestinyBudget(item, data))

        let geralBudget = destinysBudget.find((item) => item.destiny.IdDestiny === parseInt(data.params.IdDestinoGeral))

        let geralCommonCash = 0

        if (geralBudget) {
            geralCommonCash = geralBudget.commonBudget > ValorMaximoGeral ? (geralBudget.commonBudget - ValorMaximoGeral) / (destinysBudget.length - 1) : 0
        }

        return Promise.all(destinysBudget.map(async (item) => {
            let fullDestinyExpenses = await this.instance.GenerateFullBaseExpenseChild.run(month, year, IdUser, { IdDestiny: item.destiny.IdDestiny })

            let totalExpenses = parseFloat(fullDestinyExpenses.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item, { sumInactive: true }), 0).toFixed(2))

            if (item.destiny.SplitJointExpense) {
                totalExpenses += jointExpenses
            }

            if (item.destiny.IdDestiny === IdDestinoGeral) {
                item.budget = ((item.commonBudget > ValorMaximoGeral ? ValorMaximoGeral : item.commonBudget) - geralCommonCash) + item.destinyBudget
            }

            return {
                DestinyData: item.destiny,
                RemainingBudget: (item.budget + geralCommonCash) - totalExpenses
            }
        }))
    }

    private calculateDestinyBudget(destiny: destinys, data: DestinyResumeData) {
        let IdDestinoConjunto = parseInt(data.params.IdDestinoConjunto)

        let commonCash = clientUtilsUseCases.sumProp(data.cashInflows.filter((item) => item.IdDestiny === IdDestinoConjunto), "Value")
        let destinyCash = clientUtilsUseCases.sumProp(data.cashInflows.filter((item) => item.IdDestiny === destiny.IdDestiny), "Value")

        return {
            destiny: destiny,
            destinyBudget: destinyCash,
            commonBudget: (commonCash / data.destinys.length),
            budget: destinyCash + (commonCash / data.destinys.length)
        }
    }
}

//#region Interfaces / Types 

export interface DestinyResume {
    DestinyData: destinys
    RemainingBudget: number
}

interface DestinyResumeData {
    cashInflows: cashinflows[]
    destinys: destinys[]
    params: getParamReturn
}

//#endregion