import { expensesUseCase } from "@/useCases/Expenses/ExpensesUseCase";
import { NextRequest, NextResponse } from "next/server";

export class Update {
    public async run(request: NextRequest) {
        return NextResponse.json(await expensesUseCase.UpdateExpense.run(await request.json()))
    }
}