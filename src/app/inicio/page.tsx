import { Container } from "@mui/material";
import Header from "./components/Header/Header";
import { BaseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import BankResume from "./components/BankResume/BankResume";
import { UtilsUseCases } from "@/useCases/Utils/UtilsUseCases";
import DestinyResumeContainer from "./components/DestinyResume/DestinyResumeContainer";
import ResumeContainer from "./components/ResumeContainer/ResumeContainer";

export default async function Page() {
    const month = 1
    const year = 2024

    let { banksResume, destinysResume } = await UtilsUseCases.resolvePromiseObj({
        banksResume: BaseExpensesUseCases.getMonthlyBanksResume(month, year),
        destinysResume: BaseExpensesUseCases.getMonthlyDestinyResume(month, year)
    })

    return (
        <Container maxWidth="xl">
            <Header />
            <ResumeContainer month={month} year={year} />
            <DestinyResumeContainer DestinysResume={destinysResume} />
            {banksResume.map((item, index) => <BankResume bank={item} key={index} />)}
        </Container>
    )
}