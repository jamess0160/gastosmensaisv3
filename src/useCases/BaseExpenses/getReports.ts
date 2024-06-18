import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from "@/base/baseSection";
import { clientUtilsUseCases } from '../Utils/ClientUtilsUseCases';
import moment from 'moment';
import { FullBaseExpenseChild, GenerateFullBaseExpenseChildOptions } from './generateFullBaseExpenseChild';

export class GetReports extends BaseSection<BaseExpensesUseCases> {

    async run(start: moment.Moment, end: moment.Moment, description?: string, IdExpenseCategory?: string) {

        let monthYears = this.getMonthYears(start, end)

        let options: GenerateFullBaseExpenseChildOptions = IdExpenseCategory ? { IdExpenseCategory: parseInt(IdExpenseCategory) } : {}

        let rawExpenseData = await Promise.all(monthYears.map((item) => this.instance.GenerateFullBaseExpenseChild.run(item.month, item.year, options)))

        let expenseData = this.formatExpenseData(rawExpenseData, start, end)

        if (description) {
            return expenseData.filter((item) => item.Description.toLowerCase().includes(description.toLowerCase()))
        }

        return expenseData
    }

    private getMonthYears(start: moment.Moment, end: moment.Moment) {

        let monthsDiff = Math.ceil(end.diff(start, "month", true))

        let monthYears: MonthYear[] = []

        for (let i = 0; i < monthsDiff; i++) {
            let base = start.clone()

            base.add(i, "month")

            monthYears.push({ month: base.get("month"), year: base.get("year") })
        }

        return monthYears
    }

    private formatExpenseData(rawExpenseData: Array<FullBaseExpenseChild[]>, start: moment.Moment, end: moment.Moment) {
        return rawExpenseData
            .flat()
            .filter((item) => {
                if (clientUtilsUseCases.GetExpenseDate(item).getTime() < start.toDate().getTime()) {
                    return false
                }

                if (clientUtilsUseCases.GetExpenseDate(item).getTime() > end.toDate().getTime()) {
                    return false
                }

                return true
            })
            .sort((a, b) => {
                let aDate = clientUtilsUseCases.GetExpenseDate(a).getTime()
                let bDate = clientUtilsUseCases.GetExpenseDate(b).getTime()

                return aDate - bDate
            })
    }
}

interface MonthYear {
    month: number
    year: number
}