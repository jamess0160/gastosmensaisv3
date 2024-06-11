import { BankResume } from "@/useCases/BaseExpenses/getMonthlyBanksResume"
import { prisma } from "./prisma"
import { ResumeContainerData } from "@/app/inicio/components/ResumeContainer/ResumeContainer"
import { DestinyResume } from "@/useCases/BaseExpenses/getMonthlyDestinyResume"
import { FieldsData } from "@/app/components/ExpenseForm/ExpenseForm"

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

    export interface CookiesPostBody {
        month: string
        year: string
    }

    export interface CreateCashInflow {
        IdCashInflow?: number
        IdDestiny: string
        Description: string
        Value: string
    }

    export interface InicioPageData {
        month: number
        year: number
        Resumes: {
            container: ResumeContainerData
            banksResume: BankResume[]
            destinysResume: DestinyResume[]
        }
        ExpenseFormData: FieldsData
    }

    export type Promissed<T> = { [K in keyof T]: Promise<T[K]> }
}