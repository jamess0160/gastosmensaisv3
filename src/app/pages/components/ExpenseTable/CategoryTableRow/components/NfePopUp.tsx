import { NfeExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild"
import { IconButton, Dialog, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { defaultCellClass } from "../CategoryTableRow"
import { Close } from "@mui/icons-material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { Dispatch, SetStateAction } from "react"

export function NfePopUp(props: ComponentsProps) {

    const tableRows = generateTableRows(props.item)

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
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={defaultCellClass + " bg-default"}>Descrição</TableCell>
                                    <TableCell className={defaultCellClass + " bg-default"}>Quantidade</TableCell>
                                    <TableCell className={defaultCellClass + " bg-default"}>UN</TableCell>
                                    <TableCell className={defaultCellClass + " bg-default"}>Valor Unitário</TableCell>
                                    <TableCell className={defaultCellClass + " bg-default"}>Valor Total</TableCell>
                                </TableRow>
                                {tableRows}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Dialog>
    )
}

function generateTableRows(item: NfeExpenseChild) {

    let nfeitems = clientUtilsUseCases.handleTableData(item.child.nfeitems)

    return nfeitems.map((item, index) => {

        if (!item) {
            return (
                <TableRow key={index}>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                </TableRow>
            )
        }

        return (
            <TableRow key={index}>
                <TableCell className={defaultCellClass}> {item.Description} </TableCell>
                <TableCell className={defaultCellClass}> {item.Quantity} </TableCell>
                <TableCell className={defaultCellClass}> {item.UN} </TableCell>
                <TableCell className={defaultCellClass}> {item.UnityValue} </TableCell>
                <TableCell className={defaultCellClass}> {item.TotalValue} </TableCell>
            </TableRow>
        )
    })
}

interface ComponentsProps {
    item: NfeExpenseChild
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}