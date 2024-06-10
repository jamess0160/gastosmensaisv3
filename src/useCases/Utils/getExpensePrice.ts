import { ClientUtilsUseCases } from "./ClientUtilsUseCases";
import type { DefaultExpenseChild, FixedExpenseChild, InstallmentExpenseChild } from "../BaseExpenses/generateFullBaseExpenseChild";
import { BaseSection } from "@/base/baseSection";

export class GetExpenseType extends BaseSection<ClientUtilsUseCases>{

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