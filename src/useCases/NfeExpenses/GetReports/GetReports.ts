import { BaseSection } from "@/base/baseSection";
import moment from 'moment';
import { NfeExpensesUseCases } from "../NfeExpensesUseCases";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { NfeReportFormData } from "@/app/api/relatorios/controller/sections/POST/generateNfeReports";
import { baseexpenses, nfeexpenses } from "@prisma/client";
import { UtilTypes } from "@/database/UtilTypes";

export class GetReports extends BaseSection<NfeExpensesUseCases> {

    async run(start: moment.Moment, end: moment.Moment, IdUser: number, body: NfeReportFormData, useMonth: boolean) {

        let monthYears = this.getMonthYears(start, end)

        let rawData = await this.getRawData(monthYears, IdUser, body)

        let nfeData = this.formatExpenseData(rawData, start, end, useMonth)

        let nfeItems = nfeData.flatMap<NfeReportItem>((item) => {
            return item.nfeitems.map((subItem) => {
                return {
                    ...subItem,
                    ExpenseDate: item.ExpenseDate
                }
            })
        })

        return nfeItems.filter((item) => {

            let categoryResult = body.IdNfeItemCategory ? item.IdNfeItemCategory === Number(body.IdNfeItemCategory) : true

            if (!categoryResult || !body.description) {
                return categoryResult
            }

            let descriptions = body.description.split(",").map((item) => item.toLowerCase().trim())

            return descriptions.every((desc) => {

                let itemDesc = item.Description?.toLowerCase().trim() || ""

                if (desc.includes("<>")) {
                    let newDesc = desc.replace("<>", "")
                    return itemDesc.includes(newDesc) === false
                }

                return itemDesc.includes(desc)
            })
        })
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

    private getRawData(monthYears: MonthYear[], IdUser: number, body: NfeReportFormData) {
        return this.instance.prisma.nfeexpenses.findMany({
            include: {
                nfeitems: {
                    include: {
                        nfeitemcategories: true
                    }
                },
                baseexpenses: true
            },
            where: {
                baseexpenses: {
                    IdUser: IdUser,
                    IdBank: body.IdBank ? Number(body.IdBank) : undefined,
                    OR: monthYears.map((item) => {
                        return {
                            EntryDate: {
                                gte: clientUtilsUseCases.monthAndYearToMoment(item.month, item.year).subtract(3, "hours").toDate(),
                                lt: clientUtilsUseCases.monthAndYearToMoment(item.month, item.year).subtract(3, "hours").add(1, 'month').toDate(),
                            }
                        }
                    })
                }
            }
        })
    }

    private formatExpenseData(rawExpenseData: NfeExpense[], start: moment.Moment, end: moment.Moment, useMonth: boolean) {

        let sortedData = rawExpenseData
            .sort((a, b) => {
                let aDate = new Date(a.baseexpenses.EntryDate).getTime()
                let bDate = new Date(b.baseexpenses.EntryDate).getTime()

                return aDate - bDate
            })

        if (useMonth) {
            return sortedData
        }

        return sortedData.filter((item) => {
            if (new Date(item.baseexpenses.EntryDate).getTime() < start.toDate().getTime()) {
                return false
            }

            if (new Date(item.baseexpenses.EntryDate).getTime() > end.toDate().getTime()) {
                return false
            }

            return true
        })
    }
}

export interface NfeReportItem extends UtilTypes.FullNfeItem {
    ExpenseDate: Date
}

interface NfeExpense extends nfeexpenses {
    nfeitems: UtilTypes.FullNfeItem[]
    baseexpenses: baseexpenses
}

interface MonthYear {
    month: number
    year: number
}