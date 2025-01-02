import { cashinflows, cashinflowdestinys, destinys } from '@prisma/client'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from "@/base/baseSection";
import { clientUtilsUseCases } from '../Utils/ClientUtilsUseCases/ClientUtilsUseCases'
import { cashInflowsUseCases } from '../CashInflows/CashInflowsUseCases'
import { destinysUseCases } from '../Destinys/DestinysUseCases'

export class GetMonthlyDestinyResume extends BaseSection<BaseExpensesUseCases> {

    async run(month: number, year: number, IdUser: number) {
        let data = await clientUtilsUseCases.resolvePromiseObj({
            cashInflows: cashInflowsUseCases.getAllByMY(month, year, IdUser),
            destinys: destinysUseCases.getAllByUser(IdUser),
        })

        return this.generateDestinyResume(month, year, IdUser, data)
    }

    private generateDestinyResume(month: number, year: number, IdUser: number, data: DestinyResumeData): Promise<DestinyResume[]> {

        let destinysBudget = data.destinys.map((item) => this.calculateDestinyBudget(item, data))

        return Promise.all(destinysBudget.map(async (item) => {
            let fullDestinyExpenses = await this.instance.GenerateFullBaseExpenseChild.run(month, year, IdUser, { IdDestiny: item.destiny.IdDestiny })

            let totalExpenses = fullDestinyExpenses.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item, { sumInactive: true, split: true }), 0)

            return {
                DestinyData: item.destiny,
                RemainingBudget: parseFloat((item.budget - totalExpenses).toFixed(2))
            }
        }))
    }

    private calculateDestinyBudget(destiny: destinys, data: DestinyResumeData) {
        let destinyCashInflows = data.cashInflows.filter((item) => {
            let cashInflowDestinys = item.cashinflowdestinys.map((item) => item.IdDestiny)
            return cashInflowDestinys.includes(destiny.IdDestiny)
        })

        let destinyCash = destinyCashInflows.reduce((old, item) => {

            let splitCount = item.cashinflowdestinys.length

            let cashInflowValue = item.Value / splitCount

            return old + cashInflowValue
        }, 0)

        return {
            destiny: destiny,
            destinyBudget: destinyCash,
            budget: destinyCash
        }
    }
}

//#region Interfaces / Types 

export interface DestinyResume {
    DestinyData: destinys
    RemainingBudget: number
}

interface DestinyResumeData {
    cashInflows: CashInflows[]
    destinys: destinys[]
}

interface CashInflows extends cashinflows {
    cashinflowdestinys: cashinflowdestinys[]
}

//#endregion