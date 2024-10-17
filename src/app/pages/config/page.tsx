import { Container } from "@mui/material";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases";
import CashInflowsTable from "./CashInflowsTable/CashInflowsTable";
import CookieForm from "./components/CookieForm";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import CreateCashInflow from "./components/CreateCashInflow";
import { headers } from "next/headers";

export default async function Page() {

    let headersList = headers()
    let IdUser = headersList.get('IdUser')

    if (!IdUser) {
        return <div>IdUser não encontrado!</div>
    }

    let { month, year } = serverUtilsUseCases.getMonthYear()
    let destinys = await destinysUseCases.getAllByUser(Number(IdUser))

    return (
        <Container maxWidth="xl" className="pt-20 flex flex-col gap-5 items-center">
            <h1 className="w-fit m-auto mb-32 max-md:mb-5 underline">Configurações</h1>

            <CookieForm month={month.toString()} year={year.toString()} />
            <CreateCashInflow destinys={destinys} />
            <CashInflowsTable destinys={destinys} month={month} year={year} IdUser={Number(IdUser)} />
        </Container>
    )
}