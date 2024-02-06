import { BanksUseCases } from '../Banks/BanksUseCases'
import { banks, destinys } from '@prisma/client'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { UtilsUseCases } from '../Utils/UtilsUseCases'
import { DestinysUseCases } from '../Destinys/DestinysUseCases'
import { FullBaseExpenseChild } from './generateFullBaseExpenseChild'

export async function getMonthlyBanksResume(month: number, year: number) {
    let banks = await BanksUseCases.getAll()
    let detinys = await DestinysUseCases.getAll()

    return Promise.all(banks.map<Promise<BankResume>>((item) => generateBanksResume(month, year, detinys, item)))
}

async function generateBanksResume(month: number, year: number, destinys: destinys[], bank: banks): Promise<BankResume> {
    let bankExpenses = await BaseExpensesUseCases.getMonthlyBankCategory(month, year, bank.IdBank)

    return {
        BankName: bank.Name,
        TotalExpensesSum: bankExpenses.reduce((old, item) => old + UtilsUseCases.getExpensePrice(item), 0),
        Destinys: destinys.map((item) => generateBankResumeDestiny(bankExpenses, item)),
    }
}

function generateBankResumeDestiny(bankExpenses: FullBaseExpenseChild[], destiny: destinys): BankResumeDestiny {
    let destinyExpenses = bankExpenses.filter((subItem) => subItem.IdDestiny === destiny.IdDestiny)

    return {
        DestinyName: destiny.Name,
        ExpensesSum: destinyExpenses.reduce((old, item) => old + UtilsUseCases.getExpensePrice(item), 0)
    }
}

interface BankResume {
    BankName: string
    TotalExpensesSum: number
    Destinys: BankResumeDestiny[]
}

interface BankResumeDestiny {
    DestinyName: string
    ExpensesSum: number
}