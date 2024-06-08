import { BaseSection } from "@/base";
import { DefaultExpenseChild, FixedExpenseChild, FullBaseExpenseChild, InstallmentExpenseChild } from "../BaseExpenses/generateFullBaseExpenseChild";
import { UtilsUseCases } from "./UtilsUseCases";

export class GetExpenseType extends BaseSection<UtilsUseCases>{

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