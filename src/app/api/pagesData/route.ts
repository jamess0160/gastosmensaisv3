import { UtilTypes } from "@/database/UtilTypes";
import { banksUseCases } from "@/useCases/Banks/BanksUseCases";
import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";
import { expensesUseCase } from "@/useCases/Expenses/ExpensesUseCase";
import { Categories } from "@/useCases/Expenses/GetCategoriesData";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

//#region Functions 

export async function GET(request: NextRequest) {

    let { searchParams } = new URL(request.url)
    let pageRoute = searchParams.get('pageRoute')
    let session = await serverUtilsUseCases.Cookies.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    let { IdUser, UserName } = session

    if (!pageRoute) {
        return NextResponse.json({ msg: "IdCashInflow não encontrado na query!" }, { status: 406 })
    }

    if (!IdUser || !UserName) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    if (pageRoute === "inicio") {
        return NextResponse.json(await loadInicioPage(Number(IdUser), UserName))
    }

    if (pageRoute === "categorias") {
        return NextResponse.json(await loadCategoriasPage(Number(IdUser), searchParams))
    }

    if (pageRoute === "personalizacao") {
        return NextResponse.json(await loadPersonalizacaoPage(Number(IdUser)))
    }

    return NextResponse.json({ pageRoute })
}

function loadInicioPage(IdUser: number, UserName: string): Promise<UtilTypes.InicioPageData> {
    let { month, year } = serverUtilsUseCases.getMonthYear()

    return clientUtilsUseCases.resolvePromiseObj<InicioPageData>({
        month: Promise.resolve(month),
        year: Promise.resolve(year),
        selfUserName: Promise.resolve(UserName),
        ExpenseFormData: clientUtilsUseCases.resolvePromiseObj<ExpenseFormData>({
            Banks: banksUseCases.getAllByUser(IdUser),
            Destinys: destinysUseCases.getAllByUser(IdUser),
            ExpenseCategories: expenseCategoriesUseCases.getAllByUser(IdUser),
        }),
        Resumes: clientUtilsUseCases.resolvePromiseObj<Resumes>({
            container: clientUtilsUseCases.resolvePromiseObj<Container>({
                monthlyExpenseSum: baseExpensesUseCases.GetMonthlySum(month, year, IdUser),
                monthlyInflow: cashInflowsUseCases.getAllByMY(month, year, IdUser),
            }),
            banksResume: baseExpensesUseCases.GetMonthlyBanksResume.run(month, year, IdUser),
            destinysResume: baseExpensesUseCases.GetMonthlyDestinyResume.run(month, year, IdUser),
        }),
    })
}

function loadCategoriasPage(IdUser: number, searchParams: URLSearchParams): Promise<UtilTypes.CategoriasPageData> | void {
    let { month, year } = serverUtilsUseCases.getMonthYear()

    let type = searchParams.get("type") as Categories
    let id = searchParams.get("id")

    if (!type || !id) return

    return clientUtilsUseCases.resolvePromiseObj<CategoriasPageData>({
        month: Promise.resolve(month),
        year: Promise.resolve(year),
        categoriesData: expensesUseCase.GetCategoriesData.run(type, IdUser, parseInt(id), month, year),
        ExpenseFormData: clientUtilsUseCases.resolvePromiseObj<ExpenseFormData>({
            Banks: banksUseCases.getAllByUser(IdUser),
            Destinys: destinysUseCases.getAllByUser(IdUser),
            ExpenseCategories: expenseCategoriesUseCases.getAllByUser(IdUser),
        }),
    })
}

function loadPersonalizacaoPage(IdUser: number) {
    return clientUtilsUseCases.resolvePromiseObj<PersonalizacaoPageData>({
        Banks: banksUseCases.getAllByUser(IdUser),
        Destinys: destinysUseCases.getAllByUser(IdUser),
        ExpenseCategories: expenseCategoriesUseCases.getAllByUser(IdUser),
    })
}

//#endregion

//#region Interfaces / Types 

type InicioPageData = UtilTypes.Promissed<UtilTypes.InicioPageData>

type ExpenseFormData = UtilTypes.Promissed<UtilTypes.InicioPageData['ExpenseFormData']>

type Resumes = UtilTypes.Promissed<UtilTypes.InicioPageData['Resumes']>

type Container = UtilTypes.Promissed<UtilTypes.InicioPageData['Resumes']['container']>

type CategoriasPageData = UtilTypes.Promissed<UtilTypes.CategoriasPageData>

type PersonalizacaoPageData = UtilTypes.Promissed<UtilTypes.PersonalizacaoPageData>

//#endregion