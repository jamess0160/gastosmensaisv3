import { prisma } from "./prisma"

export namespace UtilTypes {

    export interface CreateExpense {
        IdBaseExpense?: number
        EntryDate: string
        Description: string
        Type: "Default" | "Fixed" | "Installment"
        ExpenseDate: string
        CurrentInstallment: string
        MaxInstallment: string
        Price: string
        IdDestiny: string
        IdExpenseCategory: string
        IdBank: string
    }

    export type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
}