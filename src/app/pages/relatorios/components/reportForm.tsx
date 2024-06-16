import { expensecategories } from "@prisma/client";
import { Input } from "../../components/fields/input";
import { Select, SelectItem } from "../../components/fields/selelct";
import { UseFormRegister } from "react-hook-form";
import { RelatorioFormData } from "@/app/api/relatorios/route";

export function ReportForm(props: ReportFormProps) {
    return (
        <div className="flex gap-10">
            <Select label="Intervalo" selectItems={intervalItems} selectProps={{ ...props.register("interval") }} />

            <Input label="Inicio" inputProps={{ ...props.register("dateStart"), type: "date", }} />

            <Input label="Final" inputProps={{ ...props.register("dateEnd"), type: "date", }} />

            <Input label="Descrição" inputProps={{ ...props.register("description") }} />

            <Select
                label="Destino"
                selectItems={props.expenseCategories.map((item) => ({ key: item.IdExpenseCategory, text: item.Description }))}
                selectProps={{ ...props.register("IdExpenseCategory") }}
            />
        </div>
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
    register: UseFormRegister<RelatorioFormData>
    expenseCategories: expensecategories[]
}