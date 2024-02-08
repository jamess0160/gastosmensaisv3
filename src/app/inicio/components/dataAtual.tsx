'use client'
import { ClientStorage } from "@/useCases/ClientStorage/ClientStorage";
import { useEffect, useState } from "react";

const monthsArray = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

export default function DataAtual() {
    let [dateData, setDateData] = useState<{ month: number, year: number }>()

    useEffect(() => {
        let data = ClientStorage.getMonthYear()
        setDateData(data)
    }, [])

    return (
        <div style={{ fontSize: "2rem" }}>
            {dateData ? `${monthsArray[dateData.month]}, ${dateData.year}` : ""}
        </div>
    )
}