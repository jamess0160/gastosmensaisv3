import { prisma } from "@/database/prisma"
import { BaseExpensesUseCases, baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases"
import { ExpenseCategoriesUseCases, expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases"
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases"
import { baseexpenses } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export class Remove {
    public async run(request: NextRequest) {

        let IdExpenseCategory = this.getIdExpenseCategory(request.url)
        let IdUser = await this.getIdUser()

        let expenses = await baseExpensesUseCases.getAllWhere({ IdExpenseCategory })

        if (expenses.length > 0) {
            let result = await serverUtilsUseCases.SseEngine.getConfirmation<ActionResult>(IdUser, "CheckExpenseCategories", {
                IdDelete: IdExpenseCategory,
                ExpensesQuantity: expenses.length
            })

            await this.handleResponse(result, expenses, IdExpenseCategory)
        } else {
            await expenseCategoriesUseCases.remove(Number(IdExpenseCategory))
        }


        return NextResponse.json({ msg: "Sucesso" })
    }

    private getIdExpenseCategory(url: string) {
        let { searchParams } = new URL(url)

        let IdExpenseCategory = searchParams.get('IdExpenseCategory')

        if (!IdExpenseCategory) {
            throw new Error("IdExpenseCategory não encontrado na query!")
        }

        return Number(IdExpenseCategory)
    }

    private async getIdUser() {
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            throw new Error("usuário não logado!")
        }

        return session.IdUser
    }

    private handleResponse(result: ActionResult, expenses: baseexpenses[], IdExpenseCategory: number) {
        return prisma.$transaction(async (tx) => {

            const baseExpensesUseCases = new BaseExpensesUseCases(tx)
            const expenseCategoriesUseCases = new ExpenseCategoriesUseCases(tx)

            let IdsBaseExpenses = expenses.map((item) => item.IdBaseExpense)

            if (result.action === "cancel") {
                return
            }

            if (result.action === "delete") {
                await baseExpensesUseCases.deleteMany(IdsBaseExpenses)
                await expenseCategoriesUseCases.remove(IdExpenseCategory)
                return
            }

            if (result.action === "update" && result.IdNew) {
                await baseExpensesUseCases.updateMany(IdsBaseExpenses, {
                    IdExpenseCategory: result.IdNew
                })
                await expenseCategoriesUseCases.remove(IdExpenseCategory)
                return
            }
        })
    }
}

interface ActionResult {
    action: "cancel" | "delete" | "update"
    IdNew?: number
}