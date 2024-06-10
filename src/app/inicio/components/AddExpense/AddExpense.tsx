'use client';

import { IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import ExpenseForm, { FieldsData } from "@/app/components/ExpenseForm/ExpenseForm";
import { useState } from "react";

export default function AddExpense({ ExpenseFormData }: ComponentProps) {
    let [openForm, setOpenForm] = useState(false)

    return (
        <div className="fixed bottom-4 right-4">
            <ExpenseForm fieldsData={ExpenseFormData} formState={openForm} setFormState={setOpenForm} />
            <IconButton className="rounded-full outline outline-1 outline-white" color="primary" onClick={() => setOpenForm(!openForm)} >
                <Add fontSize="large" />
            </IconButton>
        </div>
    )
}

interface ComponentProps {
    ExpenseFormData: FieldsData
}