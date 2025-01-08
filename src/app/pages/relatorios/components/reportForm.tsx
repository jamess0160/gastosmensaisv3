import { banks, destinys, expensecategories } from "@prisma/client";
import { Input } from "../../components/fields/input";
import { Select, SelectItem } from "../../components/fields/select";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import { RelatorioFormData } from "@/app/api/relatorios/controller/sections/POST/generateReports";

export function ReportForm(props: ReportFormProps) {
    return (
        <form
            autoComplete="off"
            className="w-full"
            onSubmit={props.onSubmit}
        >

            <div className="flex gap-10 max-md:flex-wrap justify-center mb-10">
                <Select label="Intervalo" selectItems={intervalItems} form={props.form} formProp="interval" />

                <Input label="Mês" inputProps={{ ...props.form.register("date"), type: "month" }} />

                <Input
                    label="Inicio"
                    inputProps={{
                        ...props.form.register("dateStart"),
                        type: "date",
                        disabled: Boolean(props.form.watch("date")),
                        className: Boolean(props.form.watch("date")) ? "!bg-gray-600" : ""
                    }}
                />

                <Input
                    label="Final"
                    inputProps={{
                        ...props.form.register("dateEnd"),
                        type: "date",
                        disabled: Boolean(props.form.watch("date")),
                        className: Boolean(props.form.watch("date")) ? "!bg-gray-600" : ""
                    }}
                />

            </div>

            <div className="flex gap-10 max-md:flex-wrap justify-center">

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

                <Select
                    label="Banco"
                    form={props.form}
                    formProp="IdBank"
                    selectItems={props.banks.map((item) => ({ key: item.IdBank.toString(), text: item.Name }))}
                />

            </div>

            <div className="w-full flex justify-center mt-10 gap-5">
                <Button className="w-1/4 max-md:w-full" variant="outlined" onClick={props.onClear}>Limpar</Button>
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
    onClear: () => unknown
    expenseCategories: expensecategories[]
    destinys: destinys[]
    banks: banks[]
}