import { destinys, expensecategories } from "@prisma/client";
import { Input } from "../../components/fields/input";
import { Select, SelectItem } from "../../components/fields/select";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import { RelatorioFormData } from "@/app/api/relatorios/controller/sections/POST/generateReports";

export function ReportForm(props: ReportFormProps) {
    return (
        <form onSubmit={props.onSubmit}>

            <div className="flex gap-10 max-md:flex-wrap justify-center">
                <Select label="Intervalo" selectItems={intervalItems} form={props.form} formProp="interval" />

                <Input label="Inicio" inputProps={{ ...props.form.register("dateStart"), type: "date", }} />

                <Input label="Final" inputProps={{ ...props.form.register("dateEnd"), type: "date", }} />

                <Input label="Descrição" inputProps={{ ...props.form.register("description") }} />

                <Select
                    label="Destino"
                    form={props.form}
                    formProp="IdDestiny"
                    selectItems={props.destinys.map((item) => ({ key: item.IdDestiny.toString(), text: item.Name }))}
                />

                <Select
                    label="Tipo de gasto"
                    form={props.form}
                    formProp="IdExpenseCategory"
                    selectItems={props.expenseCategories.map((item) => ({ key: item.IdExpenseCategory.toString(), text: item.Description }))}
                />

            </div>

            <div className="w-full flex justify-center mt-10">
                <Button type="submit" className="w-1/4 max-md:w-full" variant="contained">Pesquisar</Button>
            </div>

        </form>
    )
}

//#region Data

const intervalItems: SelectItem[] = [
    { key: "mes", text: "Mês" },
    { key: "semana", text: "Semana" },
    { key: "dia", text: "Dia" },
]

//#endregion

interface ReportFormProps {
    form: UseFormReturn<RelatorioFormData, any, RelatorioFormData>
    onSubmit: () => unknown
    expenseCategories: expensecategories[]
    destinys: destinys[]
}