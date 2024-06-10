import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    let data = await request.json() as { IdBaseExpense: number, Active: boolean }

    let result = await baseExpensesUseCases.update(data.IdBaseExpense, {
        Active: data.Active
    })

    return NextResponse.json(result)
}