import { Container } from "@mui/material";
import { ReportBody } from "./components/reportBody";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";
import { headers } from "next/headers";

export default async function Relatorios() {
    let headersList = headers()
    let IdUser = headersList.get('IdUser')

    if (!IdUser) {
        return <div>IdUser não encontrado!</div>
    }

    let expenseCategories = await expenseCategoriesUseCases.getAllByUser(Number(IdUser))

    return (
        <Container maxWidth="xl" className="pt-20">
            <h1 className="w-fit m-auto mb-32 max-md:mb-5 underline">Relatório de gastos</h1>

            <ReportBody expenseCategories={expenseCategories} />
        </Container>
    )
}