import { cookies } from "next/headers"

export class ServerUtilsUseCases {

    getMonthYear() {
        let month = parseInt(cookies().get("month")?.value || new Date().getMonth().toString())
        let year = parseInt(cookies().get("year")?.value || new Date().getFullYear().toString())

        return { month, year }
    }
}

export const serverUtilsUseCases = new ServerUtilsUseCases()