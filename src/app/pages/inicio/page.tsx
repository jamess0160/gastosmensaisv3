'use client';

import { CircularProgress, Container } from "@mui/material";
import Header from "./components/Header/Header";
import BankResume from "./components/BankResume/BankResume";
import DestinyResumeContainer from "./components/DestinyResume/DestinyResumeContainer";
import ResumeContainer from "./components/ResumeContainer/ResumeContainer";
import React from "react";
import AddExpense from "./components/addExpense/AddExpense";
import { UtilTypes } from "@/database/UtilTypes";
import { usePooling } from "@/app/utils/usePooling";

export default function Page() {
    let [data] = usePooling<UtilTypes.InicioPageData>("/api/pagesData", 5, { params: { pageRoute: "inicio" } })

    if (!data) {
        return <CircularProgress />
    }

    return (
        <>
            <Header month={data.month} year={data.year} />
            <Container maxWidth="xl">
                <ResumeContainer ResumeContainerData={data.Resumes.container} />
                <DestinyResumeContainer DestinysResume={data?.Resumes.destinysResume} />
                {data.Resumes.banksResume.map((item, index) => <BankResume bank={item} key={index} />)}
                <AddExpense ExpenseFormData={data.ExpenseFormData} />
            </Container>
        </>
    )
}