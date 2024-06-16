import { TableCell, TableRow } from "@mui/material"


export function EmptyRow() {
    return (
        <TableRow>
            <EmptyCell />
            <EmptyCell />
            <EmptyCell />
            <EmptyCell />
            <EmptyCell />
        </TableRow>
    )
}

export function EmptyCell() {
    return <TableCell className="text-slate-800 text-opacity-50 select-none">1</TableCell>
}