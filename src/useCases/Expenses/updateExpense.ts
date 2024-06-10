import { prisma } from '@/database/prisma'
import { BaseSection } from "@/base/baseSection";
import { ExpensesUseCase } from './ExpensesUseCase';
import { BaseExpensesUseCases, baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { DefaultExpensesUseCases, defaultExpensesUseCases } from "@/useCases/DefaultExpenses/DefaultExpensesUseCases";
import { FixedExpensesUseCases, fixedExpensesUseCases } from "@/useCases/FixedExpenses/FixedExpensesUseCases";
import { InstallmentExpensesUseCases, installmentExpensesUseCases } from "@/useCases/InstallmentExpenses/InstallmentExpensesUseCases";
import { UtilTypes } from "@/database/UtilTypes";
import { baseexpenses } from '@prisma/client';
import { clientUtilsUseCases } from '../Utils/ClientUtilsUseCases';

export class UpdateExpense extends BaseSection<ExpensesUseCase>{

    async run(createExpenseData: UtilTypes.CreateExpense) {
        if (!createExpenseData.IdBaseExpense) return { msg: "Campo 'IdBaseExpense' não encontrado" }

        let BaseExpense = await baseExpensesUseCases.getUnique(createExpenseData.IdBaseExpense)

        return prisma.$transaction(async (tx) => {
            await this.updateBaseExpense(tx, BaseExpense, createExpenseData)

            if (createExpenseData.Type === "Default") {
                return this.updateDefaultExpense(tx, BaseExpense, createExpenseData)
            }

            if (createExpenseData.Type === "Fixed") {
                return this.updateFixedExpense(tx, BaseExpense, createExpenseData)
            }

            if (createExpenseData.Type === "Installment") {
                return this.updateInstallmentExpense(tx, BaseExpense, createExpenseData)
            }
        })
    }

    private updateBaseExpense(tx: UtilTypes.PrismaTransaction, BaseExpense: baseexpenses, createExpenseData: UtilTypes.CreateExpense) {
        return new BaseExpensesUseCases(tx).update(BaseExpense.IdBaseExpense, {
            Description: createExpenseData.Description,
            IdBank: parseInt(createExpenseData.IdBank),
            IdDestiny: parseInt(createExpenseData.IdDestiny),
            IdExpenseCategory: parseInt(createExpenseData.IdExpenseCategory),
            Price: parseFloat(createExpenseData.Price),
            EntryDate: createExpenseData.EntryDate ? clientUtilsUseCases.formatClientDate(createExpenseData.EntryDate) : undefined,
        })
    }

    private async updateDefaultExpense(tx: UtilTypes.PrismaTransaction, BaseExpense: baseexpenses, createExpenseData: UtilTypes.CreateExpense) {

        let [defaultExpense] = await defaultExpensesUseCases.getByBaseExpense([BaseExpense.IdBaseExpense])

        if (!defaultExpense) {
            await new BaseExpensesUseCases(tx).deleteChilds(tx, BaseExpense.IdBaseExpense)
            return this.instance.CreateExpense.createDefaultExpense(tx, BaseExpense.IdBaseExpense, createExpenseData)
        }

        return new DefaultExpensesUseCases(tx).update(defaultExpense.IdDefaultExpense, {
            ExpenseDate: createExpenseData.EntryDate ? clientUtilsUseCases.formatClientDate(createExpenseData.EntryDate) : undefined,
        })
    }

    private async updateFixedExpense(tx: UtilTypes.PrismaTransaction, BaseExpense: baseexpenses, createExpenseData: UtilTypes.CreateExpense) {

        let [fixedExpense] = await fixedExpensesUseCases.getByBaseExpense([BaseExpense.IdBaseExpense])

        if (!fixedExpense) {
            await new BaseExpensesUseCases(tx).deleteChilds(tx, BaseExpense.IdBaseExpense)
            return this.instance.CreateExpense.createFixedExpense(tx, BaseExpense.IdBaseExpense, createExpenseData)
        }

        return new FixedExpensesUseCases(tx).update(fixedExpense.IdFixedExpense, {
            StartDate: createExpenseData.EntryDate ? clientUtilsUseCases.formatClientDate(createExpenseData.EntryDate) : undefined,
        })
    }

    private async updateInstallmentExpense(tx: UtilTypes.PrismaTransaction, BaseExpense: baseexpenses, createExpenseData: UtilTypes.CreateExpense) {

        let [installmentExpense] = await installmentExpensesUseCases.getByBaseExpense([BaseExpense.IdBaseExpense])

        if (!installmentExpense) {
            await new BaseExpensesUseCases(tx).deleteChilds(tx, BaseExpense.IdBaseExpense)
            return this.instance.CreateExpense.createInstallmentExpense(tx, BaseExpense.IdBaseExpense, createExpenseData)
        }

        return new InstallmentExpensesUseCases(tx).update(installmentExpense.IdInstallmentExpense, {
            CurrentInstallment: parseInt(createExpenseData.CurrentInstallment),
            MaxInstallment: parseInt(createExpenseData.MaxInstallment),
        })
    }
}
