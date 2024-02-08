import { getMonthlyBanksResume } from './getMonthlyBanksResume'
import { getMonthlyDestinyResume } from './getMonthlyDestinyResume'
import { getMonthlyBankCategory } from './getMonthlyBankCategory'
import { getMonthlyDestinyCategory } from './getMonthlyDestinyCategory'
import { generateFullBaseExpenseChild } from './generateFullBaseExpenseChild'
import { getMonthlySum } from './getMonthlySum'
import { create } from './create'
import { update } from './update'
import { remove } from './remove'

export const BaseExpensesUseCases = {
    getMonthlyBanksResume,
    getMonthlyDestinyResume,
    getMonthlyBankCategory,
    getMonthlyDestinyCategory,
    generateFullBaseExpenseChild,
    getMonthlySum,
    create,
    update,
    remove,
}
