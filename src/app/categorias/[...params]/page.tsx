'use client';

import { CircularProgress, Container } from "@mui/material";
import { usePooling } from "@/app/utils/usePooling";
import { Categories } from "@/useCases/Expenses/GetCategoriesData";
import { UtilTypes } from "@/database/UtilTypes";
import ExpenseGroup from "./components/ExpenseGroup";

export default function Page(props: PageProps) {
    let [type, id] = props.params.params

    let [data] = usePooling<UtilTypes.CategoriasPageData>(`/api/pagesData/`, 2, {
        params: {
            pageRoute: "categorias",
            type: type,
            id: id
        }
    })

    if (!data) {
        return <CircularProgress />
    }

    let parsedType = type === "banco" ? "Banco" : "Pessoal"

    return (
        <Container maxWidth="xl">
            <div className="visible max-md:invisible fixed top-2 right-4 rounded-xl p-3 z-10" style={{ backgroundColor: "#313338" }}>
                <div className="min-w-fit m-0 text-center underline text-2xl">{parsedType} - {data.categoriesData.name}</div>
                <div className="min-w-fit m-0 text-center underline text-xl">Total de gastos - R$ {data.categoriesData.sumExpenses}</div>
            </div>
            <div className="pt-12">
                <ExpenseGroup CategoryData={data.categoriesData.data} ExpenseFormData={data.ExpenseFormData} month={data.month} year={data.year} />
            </div>
        </Container>
    )
}

//#region Interfaces / Types 

interface PageProps {
    params: {
        params: [Categories, string]
    }
}

//#endregion