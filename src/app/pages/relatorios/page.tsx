import { Container } from "@mui/material";
import { ReportBody } from "./components/reportBody";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";

export default async function Relatorios() {
    let session = await serverUtilsUseCases.Cookies.getSession()
    let { month, year } = serverUtilsUseCases.getMonthYear()

    if (!session?.IdUser) {
        return <div>IdUser não encontrado!</div>
    }

    let { expenseCategories, destinys } = await clientUtilsUseCases.resolvePromiseObj({
        expenseCategories: expenseCategoriesUseCases.getAllByUser(session.IdUser),
        destinys: destinysUseCases.getAllByUser(session.IdUser),
    })


    return (
        <Container maxWidth="xl" className="pt-20">
            <h1 className="w-fit m-auto mb-32 max-md:mb-5 underline">Relatório de gastos</h1>

            <ReportBody expenseCategories={expenseCategories} destinys={destinys} month={month} year={year} />
        </Container>
    )
}