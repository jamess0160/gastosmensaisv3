import { BaseSection } from "@/base";
import { DefaultExpenseChild, FixedExpenseChild, FullBaseExpenseChild, InstallmentExpenseChild } from "../BaseExpenses/generateFullBaseExpenseChild";
import { UtilsUseCases } from "./UtilsUseCases";

export class GetExpensePrice extends BaseSection<UtilsUseCases>{

    run(expense: FullBaseExpenseChild) {
        if (this.isDefault(expense)) {
            return expense.Price
        }

        if (this.isFixed(expense)) {
            return expense.child.Price || expense.Price
        }

        if (this.isInstallment(expense)) {
            return expense.child.Price || expense.Price
        }

        return expense.Price
    }

    private isDefault(expense: any): expense is DefaultExpenseChild {
        return expense?.child?.IdDefaultExpense
    }

    private isFixed(expense: any): expense is FixedExpenseChild {
        return expense?.child?.IdFixedExpense
    }

    private isInstallment(expense: any): expense is InstallmentExpenseChild {
        return expense?.child?.IdInstallmentExpense
    }
}
