import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases"
import { NextRequest, NextResponse } from "next/server"

export class Remove {
    public async run(request: NextRequest) {

        let { searchParams } = new URL(request.url)
        let IdExpenseCategory = searchParams.get('IdExpenseCategory')

        if (!IdExpenseCategory) {
            return NextResponse.json({ msg: "IdExpenseCategory não encontrado na query!" }, { status: 406 })
        }

        await expenseCategoriesUseCases.remove(Number(IdExpenseCategory))

        return NextResponse.json({ msg: "Sucesso" })
    }
}