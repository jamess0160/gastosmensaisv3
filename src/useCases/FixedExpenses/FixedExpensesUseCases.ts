import { getByBaseExpense } from './getByBaseExpense'
import { create } from './create'
import { update } from './update'
import { remove } from './remove'

export const FixedExpensesUseCases = {
    getByBaseExpense,
    create,
    update,
    remove,
}