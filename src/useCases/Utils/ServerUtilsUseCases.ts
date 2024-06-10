import { cookies } from "next/headers"
import { clientUtilsUseCases } from "./ClientUtilsUseCases"

export class ServerUtilsUseCases {

    getMonthYear() {
        let month = parseInt(cookies().get("month")?.value || new Date().getMonth().toString())
        let year = parseInt(cookies().get("year")?.value || new Date().getFullYear().toString())

        return { month, year }
    }

    compareDates(date: Date) {
        let { month, year } = this.getMonthYear()

        return date.getMonth() === month && date.getFullYear() === year
    }

    getCurrMoment() {
        let { month, year } = this.getMonthYear()

        return clientUtilsUseCases.monthAndYearToMoment(month, year)
    }
}

export const serverUtilsUseCases = new ServerUtilsUseCases()