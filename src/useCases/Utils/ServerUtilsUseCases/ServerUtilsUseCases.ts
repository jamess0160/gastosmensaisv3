import { cookies } from "next/headers"
import { clientUtilsUseCases } from "../ClientUtilsUseCases/ClientUtilsUseCases"
import { CriptManager } from "./sections/criptManager"
import { SendClientMessage } from "./sections/sendClientMessage"
import { Cookies } from "./sections/cookies"
import { SseEngine } from "./sections/sse"

export class ServerUtilsUseCases {

    public readonly CriptManager = new CriptManager()
    public readonly SendClientMessage = new SendClientMessage()
    public readonly Cookies = new Cookies(this)
    public readonly SseEngine = new SseEngine()

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