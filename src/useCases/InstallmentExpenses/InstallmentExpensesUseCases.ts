import { getByBaseExpense } from './getByBaseExpense'
import { create } from './create'
import { update } from './update'
import { remove } from './remove'

export const InstallmentExpensesUseCases = {
    getByBaseExpense,
    create,
    update,
    remove,
}