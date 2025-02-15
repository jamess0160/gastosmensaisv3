import { prisma } from "@/database/prisma"
import { BaseExpensesUseCases, baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases"
import { DestinysUseCases, destinysUseCases } from "@/useCases/Destinys/DestinysUseCases"
import { ExpenseDestinysUseCases } from "@/useCases/ExpenseDestinys/ExpenseDestinysUseCases"
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases"
import { baseexpenses } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export class Remove {
    public async run(request: NextRequest) {

        let IdDestiny = this.getIdDestiny(request.url)
        let IdUser = await this.getIdUser()

        let expenses = await baseExpensesUseCases.getAllFromDestiny(IdDestiny)

        if (expenses.length > 0) {
            let result = await serverUtilsUseCases.SseEngine.getConfirmation<ActionResult>(IdUser, "CheckDestinys", {
                IdDelete: IdDestiny,
                ExpensesQuantity: expenses.length
            })

            await this.handleResponse(result, expenses, IdDestiny)
        } else {
            await destinysUseCases.remove(IdDestiny)
        }

        return NextResponse.json({ msg: "Sucesso!" })
    }

    private getIdDestiny(url: string) {
        let { searchParams } = new URL(url)

        let paramIdDestiny = searchParams.get('IdDestiny')

        if (!paramIdDestiny) {
            throw new Error("IdDestiny não encontrado na query!")
        }

        return Number(paramIdDestiny)
    }

    private async getIdUser() {
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            throw new Error("usuário não logado!")
        }

        return session.IdUser
    }

    private handleResponse(result: ActionResult, expenses: baseexpenses[], IdDestiny: number) {
        return prisma.$transaction(async (tx) => {

            const baseExpensesUseCases = new BaseExpensesUseCases(tx)
            const destinysUseCases = new DestinysUseCases(tx)
            const expenseDestinysUseCases = new ExpenseDestinysUseCases(tx)

            let IdsBaseExpenses = expenses.map((item) => item.IdBaseExpense)

            if (result.action === "cancel") {
                return
            }

            if (result.action === "delete") {
                await baseExpensesUseCases.deleteMany(IdsBaseExpenses)
                await destinysUseCases.remove(IdDestiny)
                return
            }

            if (result.action === "update" && result.IdNew) {
                await expenseDestinysUseCases.updateDestinys(IdsBaseExpenses, IdDestiny, result.IdNew)
                await destinysUseCases.remove(IdDestiny)
                return
            }
        })
    }
}

interface ActionResult {
    action: "cancel" | "delete" | "update"
    IdNew?: number
}