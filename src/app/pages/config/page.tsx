import { Container } from "@mui/material";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import CashInflowsTable from "./CashInflowsTable/CashInflowsTable";
import CookieForm from "./components/CookieForm";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import CreateCashInflow from "./components/CreateCashInflow";

export default async function Page() {

    let session = await serverUtilsUseCases.Cookies.getSession()

    if (!session?.IdUser) {
        return <div>IdUser não encontrado!</div>
    }

    let { month, year } = serverUtilsUseCases.getMonthYear()
    let destinys = await destinysUseCases.getAllByUser(session.IdUser)

    return (
        <Container maxWidth="xl" className="pt-20 flex flex-col gap-5 items-center">
            <h1 className="w-fit m-auto mb-32 max-md:mb-5 underline">Configurações</h1>

            <CookieForm month={month.toString()} year={year.toString()} />
            <CreateCashInflow destinys={destinys} />
            <CashInflowsTable destinys={destinys} month={month} year={year} IdUser={session.IdUser} />
        </Container>
    )
}