import { UtilTypes } from "@/database/UtilTypes";
import { prisma } from "@/database/prisma";
import { BaseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { DefaultExpensesUseCases } from "@/useCases/DefaultExpenses/DefaultExpensesUseCases";
import { FixedExpensesUseCases } from "@/useCases/FixedExpenses/FixedExpensesUseCases";
import { InstallmentExpensesUseCases } from "@/useCases/InstallmentExpenses/InstallmentExpensesUseCases";
import { baseexpenses } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let createExpenseData = await request.json() as UtilTypes.CreateExpense

    let result = await prisma.$transaction(async (tx) => {
        let baseExpense = await createBaseExpense(tx, createExpenseData)

        if (createExpenseData.Type === "Default") {
            return NextResponse.json(await createDefaultExpense(tx, baseExpense, createExpenseData))
        }

        if (createExpenseData.Type === "Fixed") {
            return NextResponse.json(await createFixedExpense(tx, baseExpense, createExpenseData))
        }

        if (createExpenseData.Type === "Installment") {
            return NextResponse.json(await createInstallmentExpense(tx, baseExpense, createExpenseData))
        }
    })

    revalidatePath("/inicio")

    return NextResponse.json(result)
}


function createBaseExpense(tx: UtilTypes.PrismaTransaction, createExpenseData: UtilTypes.CreateExpense) {
    return new BaseExpensesUseCases(tx).create({
        Description: createExpenseData.Description,
        IdBank: parseInt(createExpenseData.IdBank),
        IdDestiny: parseInt(createExpenseData.IdDestiny),
        IdExpenseCategory: parseInt(createExpenseData.IdExpenseCategory),
        Price: parseFloat(createExpenseData.Price),
        EntryDate: createExpenseData.EntryDate || undefined,
    })
}

function createDefaultExpense(tx: UtilTypes.PrismaTransaction, baseExpense: baseexpenses, createExpenseData: UtilTypes.CreateExpense) {
    return new DefaultExpensesUseCases(tx).create({
        IdBaseExpense: baseExpense.IdBaseExpense,
        ExpenseDate: createExpenseData.ExpenseDate || undefined,
    })
}

function createFixedExpense(tx: UtilTypes.PrismaTransaction, baseExpense: baseexpenses, createExpenseData: UtilTypes.CreateExpense) {
    return new FixedExpensesUseCases(tx).create({
        IdBaseExpense: baseExpense.IdBaseExpense,
        StartDate: createExpenseData.ExpenseDate || undefined,
    })
}

function createInstallmentExpense(tx: UtilTypes.PrismaTransaction, baseExpense: baseexpenses, createExpenseData: UtilTypes.CreateExpense) {
    return new InstallmentExpensesUseCases(tx).create({
        IdBaseExpense: baseExpense.IdBaseExpense,
        CurrentInstallment: parseInt(createExpenseData.CurrentInstallment),
        MaxInstallment: parseInt(createExpenseData.MaxInstallment),
    })
}