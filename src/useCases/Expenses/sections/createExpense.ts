import { prisma } from '@/database/prisma'
import { BaseSection } from "@/base/baseSection";
import { ExpensesUseCase } from '../ExpensesUseCase';
import { BaseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { DefaultExpensesUseCases } from "@/useCases/DefaultExpenses/DefaultExpensesUseCases";
import { FixedExpensesUseCases } from "@/useCases/FixedExpenses/FixedExpensesUseCases";
import { InstallmentExpensesUseCases } from "@/useCases/InstallmentExpenses/InstallmentExpensesUseCases";
import { UtilTypes } from "@/database/UtilTypes";
import moment from 'moment';
import { clientUtilsUseCases } from '../../Utils/ClientUtilsUseCases/ClientUtilsUseCases';
import { CreateTypes } from '@/database/CreateTypes';
import { NfeExpensesUseCases } from '../../NfeExpenses/NfeExpensesUseCases';

export class CreateExpense extends BaseSection<ExpensesUseCase>{

    async run(IdUser: number, createExpenseData: CreateTypes.CreateExpense) {
        return prisma.$transaction(async (tx) => {

            if (createExpenseData.Type === "NFE") {
                return new NfeExpensesUseCases(tx).CreateNfeExpenses.run(IdUser, createExpenseData)
            }

            let { IdBaseExpense } = await this.createBaseExpense(tx, IdUser, createExpenseData)

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

    createBaseExpense(tx: UtilTypes.PrismaTransaction, IdUser: number, createExpenseData: CreateTypes.CreateExpense) {
        return new BaseExpensesUseCases(tx).create({
            Description: createExpenseData.Description,
            IdBank: parseInt(createExpenseData.IdBank),
            IdExpenseCategory: parseInt(createExpenseData.IdExpenseCategory),
            Price: parseFloat(createExpenseData.Price.replace(",", ".")),
            EntryDate: clientUtilsUseCases.handleClientMonth(createExpenseData.EntryDate),
            IdUser: IdUser,
            expensedestinys: {
                createMany: {
                    data: createExpenseData.IdsDestinys.map((item) => {
                        return {
                            IdDestiny: Number(item)
                        }
                    })
                }
            }
        })
    }

    createDefaultExpense(tx: UtilTypes.PrismaTransaction, IdBaseExpense: number, createExpenseData: CreateTypes.CreateExpense) {
        return new DefaultExpensesUseCases(tx).create({
            IdBaseExpense: IdBaseExpense,
            ExpenseDate: clientUtilsUseCases.handleClientDate(createExpenseData.ExpenseDate),
        })
    }

    createFixedExpense(tx: UtilTypes.PrismaTransaction, IdBaseExpense: number, createExpenseData: CreateTypes.CreateExpense) {
        return new FixedExpensesUseCases(tx).create({
            IdBaseExpense: IdBaseExpense,
            StartDate: clientUtilsUseCases.handleClientMonth(createExpenseData.EntryDate),
            Price: parseFloat(createExpenseData.Price.replace(",", ".")),
        })
    }

    createInstallmentExpense(tx: UtilTypes.PrismaTransaction, IdBaseExpense: number, createExpenseData: CreateTypes.CreateExpense) {
        let CurrentInstallment = parseInt(createExpenseData.CurrentInstallment)
        let MaxInstallment = parseInt(createExpenseData.MaxInstallment)
        return new InstallmentExpensesUseCases(tx).create({
            IdBaseExpense: IdBaseExpense,
            CurrentInstallment: CurrentInstallment,
            MaxInstallment: MaxInstallment,
            ExpectedDate: moment().add((MaxInstallment - CurrentInstallment), "month").startOf("month").toDate(),
            Price: parseFloat(createExpenseData.Price.replace(",", ".")),
        })
    }
}
