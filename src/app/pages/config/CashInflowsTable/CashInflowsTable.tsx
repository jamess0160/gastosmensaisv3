import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import Row from "./components/Row";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { destinys } from "@prisma/client";

export default async function CashInflowsTable(props: CashInflowsTableProps) {

    let cashInflows = await cashInflowsUseCases.getAllByMY(props.month, props.year, props.IdUser)

    let tableData = clientUtilsUseCases.handleTableData(cashInflows)

    let rows = tableData.map((item, index) => item ? <Row key={item.IdCashInflow} item={item} destinys={props.destinys} /> : <EmptyRow key={index} />)

    return (
        <TableContainer className="bg-default-light">
            <Table>
                <TableBody>{rows}</TableBody>
            </Table>
        </TableContainer>
    )
}

function EmptyRow() {
    let classes = "text-default-light text-opacity-50 select-none"

    return (
        <TableRow>
            <TableCell className={classes}>1</TableCell>
            <TableCell className={classes}>1</TableCell>
            <TableCell className={classes}>1</TableCell>
            <TableCell className={classes}>1</TableCell>
        </TableRow>
    )
}

interface CashInflowsTableProps {
    destinys: destinys[]
    month: number
    year: number
    IdUser: number
}