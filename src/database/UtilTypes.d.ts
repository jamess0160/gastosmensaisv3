import { BankResume } from "@/useCases/BaseExpenses/getMonthlyBanksResume"
import { prisma } from "./prisma"
import { DestinyResume } from "@/useCases/BaseExpenses/getMonthlyDestinyResume"
import { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm"
import { ExpenseTypeData } from "@/useCases/Expenses/sections/GetCategoriesData"
import { ResumeContainerData } from "@/app/pages/inicio/components/ResumeContainer/ResumeContainer"
import { banks, destinys, expensecategories, nfeitemcategories, nfeitems } from "@prisma/client"

export namespace UtilTypes {

    export type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
    export type Promissed<T> = { [K in keyof T]: Promise<T[K]> }

    export interface CookiesPostBody {
        month: string
        year: string
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

    export interface PersonalizacaoPageData {
        Banks: banks[],
        Destinys: destinys[],
        ExpenseCategories: expensecategories[]
        NfeItemCategories: nfeitemcategories[]
    }

    export interface Session {
        IdUser: number
        UserName: string
        IsMobile: boolean
        AuthChallenge?: string
    }

    export type WebAuthOptionTypes = "login" | "register"

    export interface LoginData {
        username: string
        password: string
        isMobile: boolean
    }

    export interface FullNfeItem extends nfeitems {
        nfeitemcategories: nfeitemcategories | null
    }

    export interface UserChangePassword {
        current: string
        new: string
        confirmNew: string
    }
}