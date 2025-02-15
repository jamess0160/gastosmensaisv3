import { prisma } from "@/database/prisma"
import { BanksUseCases, banksUseCases } from "@/useCases/Banks/BanksUseCases"
import { BaseExpensesUseCases, baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases"
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases"
import { baseexpenses } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export class Remove {
    public async run(request: NextRequest) {

        let IdBank = this.getIdBank(request.url)

        let IdUser = await this.getIdUser()

        let expenses = await baseExpensesUseCases.getAllWhere({ IdBank })

        if (expenses.length > 0) {
            let result = await serverUtilsUseCases.SseEngine.getConfirmation<ActionResult>(IdUser, "CheckBanks", {
                IdDelete: IdBank,
                ExpensesQuantity: expenses.length
            })

            await this.handleResponse(result, expenses, IdBank)
        } else {
            await banksUseCases.remove(IdBank)
        }


        return NextResponse.json({ msg: "Sucesso" })
    }

    private getIdBank(url: string) {
        let { searchParams } = new URL(url)

        let IdBank = searchParams.get('IdBank')

        if (!IdBank) {
            throw new Error("IdBank não encontrado na query!")
        }

        return Number(IdBank)
    }

    private async getIdUser() {
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            throw new Error("usuário não logado!")
        }

        return session.IdUser
    }

    private handleResponse(result: ActionResult, expenses: baseexpenses[], IdBank: number) {
        return prisma.$transaction(async (tx) => {

            const baseExpensesUseCases = new BaseExpensesUseCases(tx)
            const banksUseCases = new BanksUseCases(tx)

            let IdsBaseExpenses = expenses.map((item) => item.IdBaseExpense)

            if (result.action === "cancel") {
                return
            }

            if (result.action === "delete") {
                await baseExpensesUseCases.deleteMany(IdsBaseExpenses)
                await banksUseCases.remove(IdBank)
                return
            }

            if (result.action === "update" && result.IdNew) {
                await baseExpensesUseCases.updateMany(IdsBaseExpenses, {
                    IdBank: result.IdNew
                })
                await banksUseCases.remove(IdBank)
                return
            }
        })
    }
}

interface ActionResult {
    action: "cancel" | "delete" | "update"
    IdNew?: number
}