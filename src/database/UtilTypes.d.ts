import { BankResume } from "@/useCases/BaseExpenses/getMonthlyBanksResume"
import { prisma } from "./prisma"
import { DestinyResume } from "@/useCases/BaseExpenses/getMonthlyDestinyResume"
import { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm"
import { ExpenseTypeData } from "@/useCases/Expenses/GetCategoriesData"
import { ResumeContainerData } from "@/app/pages/inicio/components/ResumeContainer/ResumeContainer"

export namespace UtilTypes {

    export type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
    export type Promissed<T> = { [K in keyof T]: Promise<T[K]> }

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
        selfUserName: string
        Resumes: {
            container: ResumeContainerData
            banksResume: BankResume[]
            destinysResume: DestinyResume[]
        }
        ExpenseFormData: FieldsData
    }

    export interface CategoriasPageData {
        month: number
        year: number
        ExpenseFormData: FieldsData
        categoriesData: ExpenseTypeData
    }
}