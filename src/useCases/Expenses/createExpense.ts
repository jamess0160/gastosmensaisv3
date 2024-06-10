import { prisma } from '@/database/prisma'
import { BaseSection } from "@/base/baseSection";
import { ExpensesUseCase } from './ExpensesUseCase';
import { BaseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { DefaultExpensesUseCases } from "@/useCases/DefaultExpenses/DefaultExpensesUseCases";
import { FixedExpensesUseCases } from "@/useCases/FixedExpenses/FixedExpensesUseCases";
import { InstallmentExpensesUseCases } from "@/useCases/InstallmentExpenses/InstallmentExpensesUseCases";
import { UtilTypes } from "@/database/UtilTypes";
import moment from 'moment';

export class CreateExpense extends BaseSection<ExpensesUseCase>{

    async run(createExpenseData: UtilTypes.CreateExpense) {
        return prisma.$transaction(async (tx) => {
            let { IdBaseExpense } = await this.createBaseExpense(tx, createExpenseData)

            if (createExpenseData.Type === "Default") {
                return this.createDefaultExpense(tx, IdBaseExpense, createExpenseData)
            }

            if (createExpenseData.Type === "Fixed") {
                return this.createFixedExpense(tx, IdBaseExpense, createExpenseData)
            }

            if (createExpenseData.Type === "Installment") {
                return this.createInstallmentExpense(tx, IdBaseExpense, createExpenseData)
            }
        })
    }

    createBaseExpense(tx: UtilTypes.PrismaTransaction, createExpenseData: UtilTypes.CreateExpense) {
        return new BaseExpensesUseCases(tx).create({
            Description: createExpenseData.Description,
            IdBank: parseInt(createExpenseData.IdBank),
            IdDestiny: parseInt(createExpenseData.IdDestiny),
            IdExpenseCategory: parseInt(createExpenseData.IdExpenseCategory),
            Price: parseFloat(createExpenseData.Price),
            EntryDate: createExpenseData.EntryDate || undefined,
        })
    }

    createDefaultExpense(tx: UtilTypes.PrismaTransaction, IdBaseExpense: number, createExpenseData: UtilTypes.CreateExpense) {
        return new DefaultExpensesUseCases(tx).create({
            IdBaseExpense: IdBaseExpense,
            ExpenseDate: createExpenseData.ExpenseDate || undefined,
        })
    }

    createFixedExpense(tx: UtilTypes.PrismaTransaction, IdBaseExpense: number, createExpenseData: UtilTypes.CreateExpense) {
        return new FixedExpensesUseCases(tx).create({
            IdBaseExpense: IdBaseExpense,
            StartDate: createExpenseData.ExpenseDate || undefined,
        })
    }

    createInstallmentExpense(tx: UtilTypes.PrismaTransaction, IdBaseExpense: number, createExpenseData: UtilTypes.CreateExpense) {
        let CurrentInstallment = parseInt(createExpenseData.CurrentInstallment)
        let MaxInstallment = parseInt(createExpenseData.MaxInstallment)
        return new InstallmentExpensesUseCases(tx).create({
            IdBaseExpense: IdBaseExpense,
            CurrentInstallment: CurrentInstallment,
            MaxInstallment: MaxInstallment,
            ExpectedDate: moment().add((MaxInstallment - CurrentInstallment), "month").startOf("month").toDate()
        })
    }
}
