import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { serverEventsClient } from "../../components/Sse/ServerEventsClient"
import { ConfirmDestinyDialog } from "./sections/ConfirmDestinyDialog"
import { renderComponent } from "@/useCases/Utils/ClientUtilsUseCases/sections/renderComponent"
import { banks, destinys, expensecategories, nfeitemcategories } from "@prisma/client"
import { UtilTypes } from "@/database/UtilTypes"
import { ConfirmBankDialog } from "./sections/ConfirmBankDialog"
import { ConfirmExpenseCategorieDialog } from "./sections/ConfirmExpenseCategorieDialog"

class PersonalizacaoController {

    private readonly ConfirmDestinyDialog = new ConfirmDestinyDialog()
    private readonly ConfirmBankDialog = new ConfirmBankDialog()
    private readonly ConfirmExpenseCategorieDialog = new ConfirmExpenseCategorieDialog()

    public init(data: UtilTypes.PersonalizacaoPageData) {
        clientUtilsUseCases.debouncer("PersonalizacaoInit", () => {
            this.subscribeCheckDestinys(data.Destinys)
            this.subscribeCheckBanks(data.Banks)
            this.subscribeCheckExpenseCategories(data.ExpenseCategories)
        })
    }

    private subscribeCheckDestinys(destinyList: destinys[]) {
        return serverEventsClient.subscribeAction<DeleteDestinySseData>("CheckDestinys", async (data) => {

            let unmount = () => { }

            let result = await new Promise((resolve) => {
                unmount = renderComponent(<this.ConfirmDestinyDialog.component
                    IdDelete={data.IdDelete}
                    ExpensesQuantity={data.ExpensesQuantity}
                    destinys={destinyList}
                    resolve={resolve}
                />)
            })

            unmount()

            return result
        })
    }

    private subscribeCheckBanks(bankList: banks[]) {
        return serverEventsClient.subscribeAction<DeleteDestinySseData>("CheckBanks", async (data) => {

            let unmount = () => { }

            let result = await new Promise((resolve) => {
                unmount = renderComponent(<this.ConfirmBankDialog.component
                    IdDelete={data.IdDelete}
                    ExpensesQuantity={data.ExpensesQuantity}
                    banks={bankList}
                    resolve={resolve}
                />)
            })

            unmount()

            return result
        })
    }

    private subscribeCheckExpenseCategories(categoryList: expensecategories[]) {
        return serverEventsClient.subscribeAction<DeleteDestinySseData>("CheckExpenseCategories", async (data) => {

            let unmount = () => { }

            let result = await new Promise((resolve) => {
                unmount = renderComponent(<this.ConfirmExpenseCategorieDialog.component
                    IdDelete={data.IdDelete}
                    ExpensesQuantity={data.ExpensesQuantity}
                    expensecategories={categoryList}
                    resolve={resolve}
                />)
            })

            unmount()

            return result
        })
    }
}

export const personalizacaoController = new PersonalizacaoController()

interface DeleteDestinySseData {
    IdDelete: number
    ExpensesQuantity: number
}