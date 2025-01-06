import { ClientUtilsUseCases } from "../ClientUtilsUseCases";
import type { DefaultExpenseChild, FixedExpenseChild, FullBaseExpenseChild, InstallmentExpenseChild, NfeExpenseChild } from "../../../BaseExpenses/generateFullBaseExpenseChild";
import { BaseSection } from "@/base/baseSection";

export class GetExpenseType extends BaseSection<ClientUtilsUseCases>{

    public auto(expense: FullBaseExpenseChild): AutoGetExpenseType {
        if (this.isDefault(expense)) return "default"

        if (this.isFixed(expense)) return "fixed"

        if (this.isInstallment(expense)) return "installment"

        if (this.isNfe(expense)) return "nfe"

        return "none"
    }

    public isDefault(expense: any): expense is DefaultExpenseChild {
        return Boolean(expense?.child?.IdDefaultExpense)
    }

    public isFixed(expense: any): expense is FixedExpenseChild {
        return Boolean(expense?.child?.IdFixedExpense)
    }

    public isInstallment(expense: any): expense is InstallmentExpenseChild {
        return Boolean(expense?.child?.IdInstallmentExpense)
    }

    public isNfe(expense: any): expense is NfeExpenseChild {
        return Boolean(expense?.child?.IdNfeExpense)
    }
}

export type AutoGetExpenseType = "default" | "fixed" | "installment" | "nfe" | "none"