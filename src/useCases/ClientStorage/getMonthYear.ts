'use client';

export function getMonthYear() {
    let stringMonth = localStorage.getItem('month')
    let stringYear = localStorage.getItem('year')

    return {
        month: stringMonth ? parseInt(stringMonth) : new Date().getMonth(),
        year: stringYear ? parseInt(stringYear) : new Date().getFullYear(),
    }
}