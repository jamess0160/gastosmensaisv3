'use client';

interface MonthYear {
    month?: number,
    year?: number
}

export function setMonthYear({ month, year }: MonthYear) {

    if (month === undefined && year === undefined) {
        throw new Error("Pelo menos um dos parametros (mês / ano) deve ser passado!")
    }

    if (month) {
        localStorage.setItem("month", month.toString())
    }

    if (year) {
        localStorage.setItem("year", year.toString())
    }
}