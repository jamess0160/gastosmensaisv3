import { Container } from "@mui/material";
import { ReportBody } from "./components/reportBody";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import { banksUseCases } from "@/useCases/Banks/BanksUseCases";

export default async function Relatorios() {
    let session = await serverUtilsUseCases.Cookies.getSession()
    let { month, year } = serverUtilsUseCases.getMonthYear()

    if (!session?.IdUser) {
        return <div>IdUser não encontrado!</div>
    }

    let { expenseCategories, destinys, banks } = await clientUtilsUseCases.resolvePromiseObj({
        expenseCategories: expenseCategoriesUseCases.getAllByUser(session.IdUser),
        destinys: destinysUseCases.getAllByUser(session.IdUser),
        banks: banksUseCases.getAllByUser(session.IdUser),
    })


    return (
        <Container maxWidth="xl" className="pt-10">
            <h1 className="w-fit m-auto mb-10 max-md:mb-5 underline">Relatório de gastos</h1>

            <ReportBody
                expenseCategories={expenseCategories}
                destinys={destinys}
                banks={banks}
                month={month}
                year={year}
            />
        </Container>
    )
}