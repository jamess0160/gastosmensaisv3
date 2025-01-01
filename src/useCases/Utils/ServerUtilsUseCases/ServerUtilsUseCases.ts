import { cookies } from "next/headers"
import { clientUtilsUseCases } from "../ClientUtilsUseCases"
import { UtilTypes } from "@/database/UtilTypes"
import { CriptManager } from "./criptManager"

export class ServerUtilsUseCases {

    private readonly CriptManager = new CriptManager()

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

    getSession(): Promise<UtilTypes.Session | null> {

        if (!process.env.sessionKey) {
            throw new Error("process.env.sessionKey não configurada")
        }

        let criptedSession = cookies().get(process.env.sessionKey)

        if (!criptedSession) {
            return Promise.resolve(null)
        }

        return this.CriptManager.decript(criptedSession.value)
    }

    async setSession(data: Partial<UtilTypes.Session>) {

        if (!process.env.sessionKey) {
            throw new Error("process.env.sessionKey não configurada")
        }

        cookies().set(process.env.sessionKey, await this.CriptManager.cript(data), {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        })
    }
}

export const serverUtilsUseCases = new ServerUtilsUseCases()