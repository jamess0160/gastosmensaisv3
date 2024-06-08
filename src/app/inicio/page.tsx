import { Container } from "@mui/material";
import Header from "./components/Header/Header";
import BankResume from "./components/BankResume/BankResume";
import DestinyResumeContainer from "./components/DestinyResume/DestinyResumeContainer";
import ResumeContainer from "./components/ResumeContainer/ResumeContainer";
import AddExpense from "./components/AddExpense/AddExpense";
import { utilsUseCases } from "@/useCases/Utils/UtilsUseCases";
import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { banksUseCases } from "@/useCases/Banks/BanksUseCases";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";
import React from "react";

export default async function Page() {
    let { month, year } = utilsUseCases.getMonthYear()

    let data = await utilsUseCases.resolvePromiseObj({
        banksResume: baseExpensesUseCases.GetMonthlyBanksResume.run(month, year),
        destinysResume: baseExpensesUseCases.GetMonthlyDestinyResume.run(month, year),
        Banks: banksUseCases.getAll(),
        Destinys: destinysUseCases.getAll(),
        ExpenseCategories: expenseCategoriesUseCases.getAll()
    })

    let addExpenseData = {
        Banks: data.Banks,
        Destinys: data.Destinys,
        ExpenseCategories: data.ExpenseCategories
    }

    return (
        <Container maxWidth="xl">
            <Header month={month} year={year} />
            <ResumeContainer month={month} year={year} />
            <DestinyResumeContainer DestinysResume={data.destinysResume} />
            {data.banksResume.map((item, index) => <BankResume bank={item} key={index} />)}
            <AddExpense fieldsData={addExpenseData} />
        </Container>
    )
}