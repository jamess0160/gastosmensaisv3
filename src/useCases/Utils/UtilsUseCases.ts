import moment from "moment"
import { GetExpensePrice } from "./getExpensePrice"

export class UtilsUseCases {

    readonly GetExpensePrice = new GetExpensePrice(this)

    async resolvePromiseObj<T extends Record<string, Promise<any>>>(promises: T): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
        let arrayKeys = Object.keys(promises)
        let resultPromisses = await Promise.all(Object.values(promises))

        return resultPromisses.reduce((old, item, index) => {
            old[arrayKeys[index]] = item

            return old
        }, {})
    }

    monthAndYearToMoment(month: number, year: number) {
        return moment().startOf("month").set("month", month).set("year", year)
    }
}

export const utilsUseCases = new UtilsUseCases()