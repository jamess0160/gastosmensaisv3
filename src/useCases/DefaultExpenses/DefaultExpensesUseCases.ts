import { getByBaseExpense } from './getByBaseExpense'
import { create } from './create'
import { update } from './update'
import { remove } from './remove'

export const DefaultExpensesUseCases = {
    getByBaseExpense,
    create,
    update,
    remove,
}
