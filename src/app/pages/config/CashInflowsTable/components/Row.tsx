'use client';

import { CashInflowMY } from "@/useCases/CashInflows/CashInflowsUseCases";
import { Delete, Edit } from "@mui/icons-material";
import { CircularProgress, IconButton, TableCell, TableRow } from "@mui/material";
import { destinys } from "@prisma/client";
import { useState } from "react";
import { configEvents } from "../../events/events";
import CashInflowForm from "../../components/CashInflowForm";
import { CreateTypes } from "@/database/CreateTypes";

//#region Functions 

export default function Row(props: RowProps) {
    let cellClass = "text-white text-nowrap text-clip"

    return (
        <TableRow>
            <TableCell className={cellClass + " w-1/6"}>{props.item.Description}</TableCell>
            <TableCell className={cellClass + " w-1/3"}> {formatDestinys(props.item)} </TableCell>
            <TableCell className={cellClass}> {`R$ ${props.item.Value}`} </TableCell>
            <TableCell className={cellClass}>
                <div className="flex items-center justify-end">
                    <EditItem item={props.item} destinys={props.destinys} />
                    <DeleteItem item={props.item} />
                </div>
            </TableCell>
        </TableRow>
    )
}

function formatDestinys(item: RowProps['item']) {
    return item.cashinflowdestinys.map((item) => item.destinys.Name).join(", ")
}

function EditItem(props: EditProps) {
    let [open, setOpen] = useState(true)
    let [loadingState, setLodingState] = useState(false)

    if (loadingState) {
        return (
            <>
                <CashInflowForm open={open} destinys={props.destinys} editItem={generateEditItem(props.item)} setLoading={setLodingState} setOpen={setOpen} />
                <CircularProgress size="1rem" />
            </>
        )
    }


    return (
        <IconButton onClick={() => { setLodingState(true); setOpen(true) }}>
            <Edit color="primary" />
        </IconButton>
    )
}

function generateEditItem(data: CashInflowMY): Partial<CreateTypes.CreateCashInflow> {
    return {
        IdCashInflow: data.IdCashInflow,
        Description: data.Description,
        IdsDestinys: data.cashinflowdestinys.map((item) => item.IdDestiny.toString()),
        Value: data.Value.toString(),
    }
}

function DeleteItem(props: DeleteProps) {
    let [loadingState, setLodingState] = useState(false)

    if (loadingState) {
        return <CircularProgress size="1rem" />
    }

    return (
        <IconButton onClick={() => configEvents.onDeleteItemClick(props.item, setLodingState)}>
            <Delete color="primary" />
        </IconButton>
    )
}

//#endregion

//#region Interfaces / Types 

interface RowProps {
    item: CashInflowMY
    destinys: destinys[]
}

interface EditProps extends RowProps { }

interface DeleteProps {
    item: CashInflowMY
}

//#endregion