import { Container } from "@mui/material";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases";
import { ReportBody } from "./components/reportBody";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";

export default async function Relatorios() {
    let monthYear = serverUtilsUseCases.getMonthYear()
    let expenseCategories = await expenseCategoriesUseCases.getAll()

    return (
        <Container maxWidth="xl" className="pt-20">
            <h1 className="w-fit m-auto mb-32">Relatório de gastos</h1>

            <ReportBody monthYear={monthYear} expenseCategories={expenseCategories} />
        </Container>
    )
}