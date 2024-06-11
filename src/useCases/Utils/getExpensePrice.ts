import { ClientUtilsUseCases } from "./ClientUtilsUseCases";
import type { DefaultExpenseChild, FixedExpenseChild, FullBaseExpenseChild, InstallmentExpenseChild } from "../BaseExpenses/generateFullBaseExpenseChild";
import { BaseSection } from "@/base/baseSection";

export class GetExpenseType extends BaseSection<ClientUtilsUseCases>{

    public auto(expense: FullBaseExpenseChild): AutoGetExpenseType {
        if (this.isDefault(expense)) return "default"

        if (this.isFixed(expense)) return "fixed"

        if (this.isInstallment(expense)) return "installment"

        return "none"
    }

    public isDefault(expense: any): expense is DefaultExpenseChild {
        return expense?.child?.IdDefaultExpense
    }

    public isFixed(expense: any): expense is FixedExpenseChild {
        return expense?.child?.IdFixedExpense
    }

    public isInstallment(expense: any): expense is InstallmentExpenseChild {
        return expense?.child?.IdInstallmentExpense
    }
}

export type AutoGetExpenseType = "default" | "fixed" | "installment" | "none"