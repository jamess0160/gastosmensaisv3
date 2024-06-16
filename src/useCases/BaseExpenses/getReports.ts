import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from "@/base/baseSection";
import { clientUtilsUseCases } from '../Utils/ClientUtilsUseCases';
import moment from 'moment';
import { GenerateFullBaseExpenseChildOptions } from './generateFullBaseExpenseChild';

export class GetReports extends BaseSection<BaseExpensesUseCases> {

    async run(dateStart: string, dateEnd: string, description?: string, IdExpenseCategory?: string) {
        let monthYears = this.getMonthYears(dateStart, dateEnd)

        let options: GenerateFullBaseExpenseChildOptions = IdExpenseCategory ? { IdExpenseCategory: parseInt(IdExpenseCategory) } : {}

        let rawExpenseData = await Promise.all(monthYears.map((item) => this.instance.GenerateFullBaseExpenseChild.run(item.month, item.year, options)))

        let expenseData = rawExpenseData.flat().sort((a, b) => {
            let aDate = clientUtilsUseCases.GetExpenseDate(a).getTime()
            let bDate = clientUtilsUseCases.GetExpenseDate(b).getTime()

            return aDate - bDate
        })

        if (description) {
            return expenseData.filter((item) => item.Description.toLowerCase().includes(description.toLowerCase()))
        }

        return expenseData
    }

    private getMonthYears(dateStart: string, dateEnd: string) {
        let start = moment(clientUtilsUseCases.handleClientDate(dateStart))
        let end = moment(clientUtilsUseCases.handleClientDate(dateEnd))

        let monthsDiff = Math.ceil(end.diff(start, "month", true))

        let monthYears: MonthYear[] = []

        for (let i = 0; i < monthsDiff; i++) {
            let base = start.clone()

            base.add(i, "month")

            monthYears.push({ month: base.get("month"), year: base.get("year") })
        }

        return monthYears
    }
}

interface MonthYear {
    month: number
    year: number
}