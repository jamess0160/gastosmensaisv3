import { CreateTypes } from "@/database/CreateTypes";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    let body = await request.json() as CreateTypes.CreateExpenseCategory
    let IdUser = request.headers.get("IdUser")

    await expenseCategoriesUseCases.create({
        Description: body.Description,
        IdUser: Number(IdUser),
    })

    return NextResponse.json({ msg: "Sucesso" })
}

export async function PUT(request: NextRequest) {

    let body = await request.json() as CreateTypes.CreateExpenseCategory
    let IdUser = request.headers.get("IdUser")

    if (!body.IdExpenseCategory) {
        return NextResponse.json({ msg: "body.IdExpenseCategory não encontrado!" }, { status: 500 })
    }

    await expenseCategoriesUseCases.update(body.IdExpenseCategory, {
        Description: body.Description,
        IdUser: Number(IdUser),
    })

    return NextResponse.json({ msg: "Sucesso" })
}

export async function DELETE(request: NextRequest) {

    let { searchParams } = new URL(request.url)
    let IdExpenseCategory = searchParams.get('IdExpenseCategory')

    if (!IdExpenseCategory) {
        return NextResponse.json({ msg: "IdExpenseCategory não encontrado na query!" }, { status: 406 })
    }

    await expenseCategoriesUseCases.remove(Number(IdExpenseCategory))

    return NextResponse.json({ msg: "Sucesso" })
}