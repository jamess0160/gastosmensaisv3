import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from "@/base/baseSection";
import { clientUtilsUseCases } from '../Utils/ClientUtilsUseCases/ClientUtilsUseCases';
import moment from 'moment';
import { FullBaseExpenseChild, GenerateFullBaseExpenseChildOptions } from './generateFullBaseExpenseChild';
import { ExpenseReportFormData } from '@/app/api/relatorios/controller/sections/POST/generateExpenseReports';

export class GetReports extends BaseSection<BaseExpensesUseCases> {

    async run(start: moment.Moment, end: moment.Moment, IdUser: number, body: ExpenseReportFormData, useMonth: boolean) {

        let monthYears = this.getMonthYears(start, end)

        let options = this.generateOptions(body)

        let rawExpenseData = await Promise.all(monthYears.map((item) => this.instance.GenerateFullBaseExpenseChild.run(item.month, item.year, IdUser, options)))

        let expenseData = this.formatExpenseData(rawExpenseData, start, end, useMonth)

        if (body.description) {
            let descriptions = body.description.split(",").map((item) => item.toLowerCase().trim())

            return expenseData.filter((item) => {
                return descriptions.every((desc) => {

                    let itemDesc = item.Description.toLowerCase().trim()

                    if (desc.includes("<>")) {
                        let newDesc = desc.replace("<>", "")
                        return itemDesc.includes(newDesc) === false
                    }

                    return itemDesc.includes(desc)
                })
            })
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

    private generateOptions(body: ExpenseReportFormData): GenerateFullBaseExpenseChildOptions {

        let options: Partial<GenerateFullBaseExpenseChildOptions> = {}

        if (body.IdExpenseCategory) {
            options.IdExpenseCategory = parseInt(body.IdExpenseCategory)
        }

        if (body.IdDestiny) {
            options.IdDestiny = parseInt(body.IdDestiny)
        }

        if (body.IdBank) {
            options.IdBank = parseInt(body.IdBank)
        }

        return options
    }

    private formatExpenseData(rawExpenseData: Array<FullBaseExpenseChild[]>, start: moment.Moment, end: moment.Moment, useMonth: boolean) {

        let sortedData = rawExpenseData
            .flat()
            .sort((a, b) => {
                let aDate = clientUtilsUseCases.GetExpenseDate(a).getTime()
                let bDate = clientUtilsUseCases.GetExpenseDate(b).getTime()

                return aDate - bDate
            })

        if (useMonth) {
            return sortedData
        }

        return sortedData.filter((item) => {
            if (clientUtilsUseCases.GetExpenseDate(item).getTime() < start.toDate().getTime()) {
                return false
            }

            if (clientUtilsUseCases.GetExpenseDate(item).getTime() > end.toDate().getTime()) {
                return false
            }

            return true
        })
    }
}

interface MonthYear {
    month: number
    year: number
}