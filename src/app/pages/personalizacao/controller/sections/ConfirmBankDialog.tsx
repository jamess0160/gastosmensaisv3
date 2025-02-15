import { Select } from "@/app/pages/components/fields/select"
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { banks } from "@prisma/client"
import { useForm } from "react-hook-form"

export function ConfirmBankDialog(props: Props) {

    let form = useForm<{ IdNew: string }>()

    let buttonClass = "w-fit rounded-lg p-2 px-4"

    let banks = props.banks.filter((item) => item.IdBank !== props.IdDelete)

    return (
        <Dialog open={true} PaperProps={{ className: "w-1/4 max-md:w-4/5 bg-default text-white" }}>
            <DialogTitle>Confirmar</DialogTitle>
            <DialogContent>
                <div className="flex flex-col gap-5">
                    Esse banco possui {props.ExpensesQuantity} gastos atrelados a ele, o que vocês gostaria de fazer com eles?

                    <Select
                        form={form}
                        formProp="IdNew"
                        label="Novo banco" selectItems={banks.map((item) => ({ key: item.IdBank.toString(), text: item.Name }))}
                    />

                    <div className="w-full flex justify-around mt-4">

                        <Button
                            className={buttonClass}
                            style={{ backgroundColor: "#374059", color: "white", borderColor: "#D9D9D9" }}
                            onClick={() => props.resolve({ action: "delete" })}
                        >
                            Deletar todos
                        </Button>

                        <Button
                            className={buttonClass}
                            style={{ backgroundColor: "#36b37e", color: "white", borderColor: "#D9D9D9" }}
                            onClick={() => {

                                if (!form.getValues()['IdNew']) {
                                    return
                                }

                                props.resolve({ action: "update", IdNew: Number(form.getValues()['IdNew']) })
                            }}
                        >
                            Confirmar
                        </Button>

                        <Button
                            className={buttonClass}
                            style={{ backgroundColor: "#ff5630", color: "white" }}
                            onClick={() => props.resolve({ action: "cancel" })}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface Props {
    IdDelete: number
    ExpensesQuantity: number
    banks: banks[]
    resolve: (result: PromiseResult) => void
}

interface PromiseResult {
    action: "cancel" | "delete" | "update"
    IdNew?: number
}