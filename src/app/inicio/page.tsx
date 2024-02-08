import { Container } from "@mui/material";
import Header from "./components/header";
import { BaseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import BankResume from "./components/BankResume/BankResume";
import { UtilsUseCases } from "@/useCases/Utils/UtilsUseCases";
import DestinyResumeContainer from "./components/DestinyResume/DestinyResumeContainer";

export default async function Page() {
    let { banksResume, destinysResume } = await UtilsUseCases.resolvePromiseObj({
        banksResume: BaseExpensesUseCases.getMonthlyBanksResume(1, 2024),
        destinysResume: BaseExpensesUseCases.getMonthlyDestinyResume(1, 2024),
    })

    return (
        <Container maxWidth="xl">
            <Header />
            <DestinyResumeContainer DestinysResume={destinysResume} />
            {banksResume.map((item, index) => <BankResume bank={item} key={index} />)}
        </Container>
    )
}