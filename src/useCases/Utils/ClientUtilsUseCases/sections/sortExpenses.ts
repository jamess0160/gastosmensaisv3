import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild";
import { clientUtilsUseCases } from "../ClientUtilsUseCases";

export class SortExpenses {
    public run(data: FullBaseExpenseChild[]) {

        let categorizedData = this.getCategorizedData(data)

        return categorizedData
            .sort((a, b) => {
                return a.order - b.order
            })
            .map((item) => {
                return data[item.index]
            })
    }

    private getCategorizedData(data: FullBaseExpenseChild[]) {
        return data.map((item, index) => {
            if (clientUtilsUseCases.GetExpenseType.isFixed(item)) {
                return { index, order: 1 }
            }

            if (clientUtilsUseCases.GetExpenseType.isInstallment(item)) {
                return { index, order: 2 }
            }

            let date = clientUtilsUseCases.GetExpenseDate(item)

            return { index, order: new Date(date).getTime() }
        })
    }

}