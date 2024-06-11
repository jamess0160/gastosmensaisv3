'use client';

import { CircularProgress, Container } from "@mui/material";
import { usePooling } from "@/app/utils/usePooling";
import { Categories } from "@/useCases/Expenses/GetCategoriesData";
import { UtilTypes } from "@/database/UtilTypes";
import ExpenseType from "./components/expenseType";

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
            <div className="fixed top-2 right-4">
                <h1 className="min-w-fit m-0 text-center underline" >{`${parsedType} - ${data.categoriesData.name}`}</h1>
            </div>
            <div className="pt-12">
                {data.categoriesData.data.map((item) => data && <ExpenseType id={`Category${item.IdExpenseCategory.toString()}`} key={item.IdExpenseCategory} CategorieData={item} ExpenseFormData={data.ExpenseFormData} month={data.month} year={data.year} />)}
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