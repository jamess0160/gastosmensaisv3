import { BankResume } from "@/useCases/BaseExpenses/getMonthlyBanksResume"
import { prisma } from "./prisma"
import { DestinyResume } from "@/useCases/BaseExpenses/getMonthlyDestinyResume"
import { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm"
import { ExpenseTypeData } from "@/useCases/Expenses/GetCategoriesData"
import { ResumeContainerData } from "@/app/pages/inicio/components/ResumeContainer/ResumeContainer"

export namespace CreateTypes {

    export interface CreateExpense {
        IdBaseExpense?: number
        EntryDate: string
        Description: string
        Type: "Default" | "Fixed" | "Installment"
        ExpenseDate: string
        CurrentInstallment: string
        MaxInstallment: string
        Price: string
        IdsDestinys: string[]
        IdExpenseCategory: string
        IdBank: string
    }

    export interface CreateCashInflow {
        IdCashInflow?: number
        IdsDestinys: string[]
        Description: string
        Value: string
    }

    export interface CreateDestiny {
        IdDestiny?: number
        Name: string
        Color: string
    }

    export interface CreateBank {
        IdBank?: number
        Name: string
        Color: string
    }

    export interface CreateExpenseCategory {
        IdExpenseCategory?: number
        Description: string
    }
}