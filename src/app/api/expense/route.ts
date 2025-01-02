import { NextRequest, NextResponse } from "next/server";
import { expensesUseCase } from "@/useCases/Expenses/ExpensesUseCase";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { redirect } from "next/navigation";

// Create expense
export async function POST(request: NextRequest) {
    let session = await serverUtilsUseCases.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    let { IdUser } = session

    return NextResponse.json(await expensesUseCase.CreateExpense.run(Number(IdUser), await request.json()))
}

export async function PUT(request: NextRequest) {
    return NextResponse.json(await expensesUseCase.UpdateExpense.run(await request.json()))
}

// Delete expense
export async function DELETE(request: NextRequest) {
    let { searchParams } = new URL(request.url)
    let IdBaseExpense = searchParams.get('IdBaseExpense')

    if (!IdBaseExpense) {
        return NextResponse.json({ msg: "IdBaseExpense não encontrado na query!" }, { status: 406 })
    }

    return NextResponse.json(await expensesUseCase.deleteExpense(parseInt(IdBaseExpense)))
}