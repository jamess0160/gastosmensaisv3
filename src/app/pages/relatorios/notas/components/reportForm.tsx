import { banks, destinys, expensecategories, nfeitemcategories } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import { ExpenseReportFormData } from "@/app/api/relatorios/controller/sections/POST/generateExpenseReports";
import { Select, SelectItem } from "@/app/pages/components/fields/select";
import { Input } from "@/app/pages/components/fields/input";
import { NfeReportFormData } from "@/app/api/relatorios/controller/sections/POST/generateNfeReports";

export function ReportForm(props: ReportFormProps) {
    return (
        <form
            autoComplete="off"
            className="w-full"
            onSubmit={props.onSubmit}
        >

            <div className="flex gap-10 flex-wrap justify-center mb-10">
                <div className="w-1/5 max-md:w-full">
                    <Select label="Intervalo" selectItems={intervalItems} form={props.form} formProp="interval" />
                </div>

                <div className="w-1/5 max-md:w-full">
                    <Input label="Mês" inputProps={{ ...props.form.register("date"), type: "month" }} />
                </div>

                <div className="w-1/5 max-md:w-full">
                    <Input
                        label="Inicio"
                        inputProps={{
                            ...props.form.register("dateStart"),
                            type: "date",
                            disabled: Boolean(props.form.watch("date")),
                            className: Boolean(props.form.watch("date")) ? "!bg-gray-600" : ""
                        }}
                    />
                </div>

                <div className="w-1/5 max-md:w-full">
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

                <div className="w-1/5 max-md:w-full">
                    <Input label="Descrição" inputProps={{ ...props.form.register("description") }} />
                </div>

                <div className="w-1/5 max-md:w-full">
                    <Select
                        label="Categoria"
                        form={props.form}
                        formProp="IdNfeItemCategory"
                        selectItems={props.nfeItemCategories.map((item) => ({ key: item.IdNfeItemCategory.toString(), text: item.Description }))}
                    />
                </div>

                <div className="w-1/5 max-md:w-full">
                    <Select
                        label="Banco"
                        form={props.form}
                        formProp="IdBank"
                        selectItems={props.banks.map((item) => ({ key: item.IdBank.toString(), text: item.Name }))}
                    />
                </div>

            </div>

            <div className="w-full flex justify-center mt-10 gap-5">
                <Button className="w-1/5 max-md:w-full" variant="outlined" onClick={props.onClear}>Limpar</Button>
                <Button type="submit" className="w-1/5 max-md:w-full" variant="contained">Pesquisar</Button>
            </div>

        </form>
    )
}

//#region Data

const intervalItems: SelectItem[] = [
    { key: "mes", text: "Mês" },
    { key: "semana", text: "Semana" },
    { key: "dia", text: "Dia" },
    { key: "soma", text: "Soma" },
]

//#endregion

interface ReportFormProps {
    form: UseFormReturn<NfeReportFormData, any, NfeReportFormData>
    onSubmit: () => unknown
    onClear: () => unknown
    expenseCategories: expensecategories[]
    nfeItemCategories: nfeitemcategories[]
    banks: banks[]
}