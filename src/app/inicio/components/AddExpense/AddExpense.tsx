'use client';
import { Button, Dialog, IconButton } from "@mui/material";
import { Add } from '@mui/icons-material'
import styles from './AddExpense.module.css'
import { Dispatch, SetStateAction, useState } from "react";

export default function AddExpense() {
    let [openForm, setOpenForm] = useState(false)

    return (
        <div className={styles.Footer}>
            <Form state={openForm} setState={setOpenForm} />
            <IconButton className={styles.Button} color="primary" onClick={() => setOpenForm(!openForm)} >
                <Add fontSize="large" />
            </IconButton>
        </div>
    )
}

interface FormProps {
    state: boolean
    setState: Dispatch<SetStateAction<boolean>>
}

function Form({ state, setState }: FormProps) {
    return (
        <Dialog open={state} >
            <Button onClick={() => setState(false)} >Fechar</Button>
        </Dialog >
    )
}