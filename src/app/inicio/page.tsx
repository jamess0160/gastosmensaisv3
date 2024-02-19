import { Container } from "@mui/material";
import Header from "./components/Header/Header";
import { BaseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import BankResume from "./components/BankResume/BankResume";
import { UtilsUseCases } from "@/useCases/Utils/UtilsUseCases";
import DestinyResumeContainer from "./components/DestinyResume/DestinyResumeContainer";
import ResumeContainer from "./components/ResumeContainer/ResumeContainer";
import AddExpense from "./components/AddExpense/AddExpense";
import { cookies } from "next/headers";

export default async function Page() {
    const month = parseInt(cookies().get("month")?.value || new Date().getMonth().toString())
    const year = parseInt(cookies().get("year")?.value || new Date().getFullYear().toString())

    let { banksResume, destinysResume } = await UtilsUseCases.resolvePromiseObj({
        banksResume: BaseExpensesUseCases.getMonthlyBanksResume(month, year),
        destinysResume: BaseExpensesUseCases.getMonthlyDestinyResume(month, year)
    })

    return (
        <Container maxWidth="xl">
            <Header month={month} year={year} />
            <ResumeContainer month={month} year={year} />
            <DestinyResumeContainer DestinysResume={destinysResume} />
            {banksResume.map((item, index) => <BankResume bank={item} key={index} />)}
            <AddExpense />
        </Container>
    )
}