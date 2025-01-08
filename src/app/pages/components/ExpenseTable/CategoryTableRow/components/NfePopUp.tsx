import { NfeExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild"
import { IconButton, Dialog } from "@mui/material"
import { Close } from "@mui/icons-material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { Dispatch, SetStateAction } from "react"
import { NfeTable } from "../../../NfeTable/NfeTable"

export function NfePopUp(props: ComponentsProps) {

    const closeClick = () => {
        props.setOpen(false)
    }

    return (
        <Dialog open={props.open} PaperProps={{ className: "w-screen max-w-none max-md:max-h-screen max-md:max-h-screen max-md:m-0" }}>
            <div className="bg-default-light h-full">

                <div className="pl-2 pr-2 pt-2 pb-2 sticky top-0 bg-default-light">
                    <div className="flex flex-row justify-between h-fit">
                        <h2 className="text-white m-0">Items da nota fiscal</h2>
                        <IconButton className="rounded-full outline outline-1 outline-white" color="primary" onClick={closeClick}>
                            <Close />
                        </IconButton>
                    </div>

                    <div className="flex flex-col gap-5 mb-5">
                        <div className="text-white">Empresa: {props.item.child.Company}</div>
                        <div className="text-white" style={{ overflowWrap: 'break-word', }}>DANFE: {props.item.child.DanfeCode}</div>
                        <div className="text-white">Valor total: {clientUtilsUseCases.GetExpensePrice(props.item, { split: false })}</div>
                    </div>
                </div>

                <div>
                    <NfeTable nfeitems={props.item.child.nfeitems} />
                </div>
            </div>
        </Dialog>
    )
}

interface ComponentsProps {
    item: NfeExpenseChild
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}