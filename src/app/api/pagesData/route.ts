import { UtilTypes } from "@/database/UtilTypes";
import { banksUseCases } from "@/useCases/Banks/BanksUseCases";
import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

//#region Functions 

export async function GET(request: NextRequest) {

    let { searchParams } = new URL(request.url)
    let pageRoute = searchParams.get('pageRoute')

    if (!pageRoute) {
        return NextResponse.json({ msg: "IdCashInflow não encontrado na query!" }, { status: 406 })
    }

    if (pageRoute === "inicio") {
        return NextResponse.json(await loadInicioPage())
    }

    return NextResponse.json({ pageRoute })
}

function loadInicioPage(): Promise<UtilTypes.InicioPageData> {
    let { month, year } = serverUtilsUseCases.getMonthYear()

    return clientUtilsUseCases.resolvePromiseObj<InicioPageData>({
        month: Promise.resolve(month),
        year: Promise.resolve(year),
        ExpenseFormData: clientUtilsUseCases.resolvePromiseObj<ExpenseFormData>({
            Banks: banksUseCases.getAll(),
            Destinys: destinysUseCases.getAll(),
            ExpenseCategories: expenseCategoriesUseCases.getAll(),
        }),
        Resumes: clientUtilsUseCases.resolvePromiseObj<Resumes>({
            container: clientUtilsUseCases.resolvePromiseObj<Container>({
                monthlyExpenseSum: baseExpensesUseCases.GetMonthlySum(month, year),
                monthlyInflow: cashInflowsUseCases.getAllByMY(month, year),
            }),
            banksResume: baseExpensesUseCases.GetMonthlyBanksResume.run(month, year),
            destinysResume: baseExpensesUseCases.GetMonthlyDestinyResume.run(month, year),
        }),
    })
}

function loadCategoriasPage() {

}

//#endregion

//#region Interfaces / Types 

type InicioPageData = UtilTypes.Promissed<UtilTypes.InicioPageData>

type ExpenseFormData = UtilTypes.Promissed<UtilTypes.InicioPageData['ExpenseFormData']>

type Resumes = UtilTypes.Promissed<UtilTypes.InicioPageData['Resumes']>

type Container = UtilTypes.Promissed<UtilTypes.InicioPageData['Resumes']['container']>

//#endregion