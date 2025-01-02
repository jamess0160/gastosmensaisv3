import { expensesUseCase } from "@/useCases/Expenses/ExpensesUseCase"
import { NextRequest, NextResponse } from "next/server"

export class Remove {
    public async run(request: NextRequest) {
        let { searchParams } = new URL(request.url)
        let IdBaseExpense = searchParams.get('IdBaseExpense')

        if (!IdBaseExpense) {
            return NextResponse.json({ msg: "IdBaseExpense não encontrado na query!" }, { status: 406 })
        }

        return NextResponse.json(await expensesUseCase.deleteExpense(parseInt(IdBaseExpense)))
    }
}