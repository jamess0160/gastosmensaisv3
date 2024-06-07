import { Container } from "@mui/material";
import Header from "./components/Header/Header";
import BankResume from "./components/BankResume/BankResume";
import DestinyResumeContainer from "./components/DestinyResume/DestinyResumeContainer";
import ResumeContainer from "./components/ResumeContainer/ResumeContainer";
import AddExpense from "./components/AddExpense/AddExpense";
import { cookies } from "next/headers";
import { utilsUseCases } from "@/useCases/Utils/UtilsUseCases";
import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { banksUseCases } from "@/useCases/Banks/BanksUseCases";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";

export default async function Page() {
    const month = parseInt(cookies().get("month")?.value || new Date().getMonth().toString())
    const year = parseInt(cookies().get("year")?.value || new Date().getFullYear().toString())

    let { banksResume, destinysResume, Banks, Destinys, ExpenseCategories } = await utilsUseCases.resolvePromiseObj({
        banksResume: baseExpensesUseCases.GetMonthlyBanksResume.run(month, year),
        destinysResume: baseExpensesUseCases.GetMonthlyDestinyResume.run(month, year),
        Banks: banksUseCases.getAll(),
        Destinys: destinysUseCases.getAll(),
        ExpenseCategories: expenseCategoriesUseCases.getAll()
    })

    return (
        <Container maxWidth="xl">
            <Header month={month} year={year} />
            <ResumeContainer month={month} year={year} />
            <DestinyResumeContainer DestinysResume={destinysResume} />
            {banksResume.map((item, index) => <BankResume bank={item} key={index} />)}
            <AddExpense fieldsData={{ Banks, Destinys, ExpenseCategories }} />
        </Container>
    )
}