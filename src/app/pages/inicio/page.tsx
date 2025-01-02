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
import { WebAuth } from "../components/WebAuth/WebAuth";

export default function Page() {
    let { data, force } = usePooling<UtilTypes.InicioPageData>("/api/pagesData", 5, { params: { pageRoute: "inicio" } })

    if (!data) {
        return <CircularProgress />
    }

    let banksResume = getBanksResume(data.Resumes.banksResume)

    return (
        <>
            <Header month={data.month} year={data.year} userName={data.selfUserName} />
            <Container maxWidth="xl">
                <ResumeContainer ResumeContainerData={data.Resumes.container} />
                <DestinyResumeContainer DestinysResume={data?.Resumes.destinysResume} />
                {banksResume}
                <AddExpense ExpenseFormData={data.ExpenseFormData} force={force} />
                <WebAuth />
            </Container>
        </>
    )
}

function getBanksResume(banksResume: UtilTypes.InicioPageData['Resumes']['banksResume']) {

    if (banksResume.length === 0) {
        return (
            <div className="text-center mt-10">
                Você ainda não tem bancos cadastrados! Cadastre eles no menu &quot;Personalização&quot;
            </div>
        )
    }

    return banksResume.map((item, index) => <BankResume bank={item} key={index} />)
}