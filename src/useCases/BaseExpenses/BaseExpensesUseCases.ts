import { getMonthlyBanksResume } from './getMonthlyBanksResume'
import { getMonthlyPersonalResume } from './getMonthlyPersonalResume'
import { getMonthlyBankCategory } from './getMonthlyBankCategory'
import { getMonthlyPersonalCategory } from './getMonthlyPersonalCategory'
import { create } from './create'
import { update } from './update'
import { remove } from './remove'

export const BaseExpensesUseCases = {
    getMonthlyBanksResume,
    getMonthlyPersonalResume,
    getMonthlyBankCategory,
    getMonthlyPersonalCategory,
    create,
    update,
    remove,
}
