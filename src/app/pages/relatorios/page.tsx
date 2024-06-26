import { Container } from "@mui/material";
import { ReportBody } from "./components/reportBody";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";

export default async function Relatorios() {
    let expenseCategories = await expenseCategoriesUseCases.getAll()

    return (
        <Container maxWidth="xl" className="pt-20">
            <h1 className="w-fit m-auto mb-32 max-md:mb-5 underline">Relatório de gastos</h1>

            <ReportBody expenseCategories={expenseCategories} />
        </Container>
    )
}