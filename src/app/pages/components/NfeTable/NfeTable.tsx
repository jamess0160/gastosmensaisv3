import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { defaultCellClass } from "../ExpenseTable/CategoryTableRow/CategoryTableRow";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { nfeitems } from "@prisma/client";

export function NfeTable({ nfeitems }: { nfeitems: nfeitems[] }) {
    let tableNfeitems = clientUtilsUseCases.handleTableData(nfeitems)

    let tableRows = generateTableRows(tableNfeitems)

    return (
        <TableContainer className="bg-default-light">
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
    )
}

function generateTableRows(nfeitems: Array<nfeitems | false>) {

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