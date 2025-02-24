import { prisma } from '@/database/prisma'
import { BaseSection } from "@/base/baseSection";
import { ExpensesUseCase } from '../ExpensesUseCase';
import { BaseExpensesUseCases, baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { DefaultExpensesUseCases, defaultExpensesUseCases } from "@/useCases/DefaultExpenses/DefaultExpensesUseCases";
import { FixedExpensesUseCases, fixedExpensesUseCases } from "@/useCases/FixedExpenses/FixedExpensesUseCases";
import { InstallmentExpensesUseCases, installmentExpensesUseCases } from "@/useCases/InstallmentExpenses/InstallmentExpensesUseCases";
import { UtilTypes } from "@/database/UtilTypes";
import { baseexpenses } from '@prisma/client';
import { clientUtilsUseCases } from '../../Utils/ClientUtilsUseCases/ClientUtilsUseCases';
import { serverUtilsUseCases } from '../../Utils/ServerUtilsUseCases/ServerUtilsUseCases';
import { CreateTypes } from '@/database/CreateTypes';
import { ExpenseDestinysUseCases } from '../../ExpenseDestinys/ExpenseDestinysUseCases';
import { NfeExpensesUseCases } from '@/useCases/NfeExpenses/NfeExpensesUseCases';
import moment from 'moment';

export class UpdateExpense extends BaseSection<ExpensesUseCase>{

    async run(createExpenseData: CreateTypes.CreateExpense) {
        if (!createExpenseData.IdBaseExpense) return { msg: "Campo 'IdBaseExpense' não encontrado" }

        let BaseExpense = await baseExpensesUseCases.getUnique(createExpenseData.IdBaseExpense)

        return prisma.$transaction(async (tx) => {
            await this.clearExpenseDestinys(tx, BaseExpense.IdBaseExpense)

            if (createExpenseData.Type === "NFE") {
                return new NfeExpensesUseCases(tx).UpdateNfeExpenses.run(BaseExpense, createExpenseData)
            }

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

    private clearExpenseDestinys(tx: UtilTypes.PrismaTransaction, IdBaseExpense: number) {
        return new ExpenseDestinysUseCases(tx).deleteExpenseChilds(IdBaseExpense)
    }

    public updateBaseExpense(tx: UtilTypes.PrismaTransaction, BaseExpense: baseexpenses, createExpenseData: CreateTypes.CreateExpense) {
        return new BaseExpensesUseCases(tx).update(BaseExpense.IdBaseExpense, {
            Description: createExpenseData.Description,
            IdBank: parseInt(createExpenseData.IdBank),
            IdExpenseCategory: parseInt(createExpenseData.IdExpenseCategory),
            Price: parseFloat(createExpenseData.Price.replace(",", ".")),
            EntryDate: clientUtilsUseCases.handleClientMonth(createExpenseData.EntryDate),
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

    private async updateDefaultExpense(tx: UtilTypes.PrismaTransaction, BaseExpense: baseexpenses, createExpenseData: CreateTypes.CreateExpense) {

        let defaultExpense = await defaultExpensesUseCases.getFirstByBaseExpense([BaseExpense.IdBaseExpense])

        if (!defaultExpense) {
            await new BaseExpensesUseCases(tx).deleteChilds(BaseExpense.IdBaseExpense)
            return this.instance.CreateExpense.createDefaultExpense(tx, BaseExpense.IdBaseExpense, createExpenseData)
        }

        return new DefaultExpensesUseCases(tx).update(defaultExpense.IdDefaultExpense, {
            ExpenseDate: clientUtilsUseCases.handleClientDate(createExpenseData.ExpenseDate),
        })
    }

    private async updateFixedExpense(tx: UtilTypes.PrismaTransaction, BaseExpense: baseexpenses, createExpenseData: CreateTypes.CreateExpense) {

        let fixedExpense = await fixedExpensesUseCases.getFirstByBaseExpense(BaseExpense.IdBaseExpense)

        if (!fixedExpense) {
            await new BaseExpensesUseCases(tx).deleteChilds(BaseExpense.IdBaseExpense)
            return this.instance.CreateExpense.createFixedExpense(tx, BaseExpense.IdBaseExpense, createExpenseData)
        }

        if (serverUtilsUseCases.compareDates(fixedExpense.StartDate)) {
            return new FixedExpensesUseCases(tx).update(fixedExpense.IdFixedExpense, {
                StartDate: clientUtilsUseCases.handleClientDate(createExpenseData.EntryDate),
                Price: parseFloat(createExpenseData.Price.replace(",", "."))
            })
        }

        await new FixedExpensesUseCases(tx).update(fixedExpense.IdFixedExpense, {
            EndDate: serverUtilsUseCases.getCurrMoment().subtract(1, "month").toDate()
        })

        return this.instance.CreateExpense.createFixedExpense(tx, BaseExpense.IdBaseExpense, {
            ...createExpenseData,
            EntryDate: serverUtilsUseCases.getCurrMoment().format("YYYY-MM")
        })
    }

    private async updateInstallmentExpense(tx: UtilTypes.PrismaTransaction, BaseExpense: baseexpenses, createExpenseData: CreateTypes.CreateExpense) {

        let installmentExpense = await installmentExpensesUseCases.getFirstByBaseExpense([BaseExpense.IdBaseExpense])

        if (!installmentExpense) {
            await new BaseExpensesUseCases(tx).deleteChilds(BaseExpense.IdBaseExpense)
            return this.instance.CreateExpense.createInstallmentExpense(tx, BaseExpense.IdBaseExpense, createExpenseData)
        }

        if (serverUtilsUseCases.compareDates(BaseExpense.EntryDate)) {

            let CurrentInstallment = parseInt(createExpenseData.CurrentInstallment)
            let MaxInstallment = parseInt(createExpenseData.MaxInstallment)

            let currMoment = serverUtilsUseCases.getCurrMoment()

            return new InstallmentExpensesUseCases(tx).update(installmentExpense.IdInstallmentExpense, {
                CurrentInstallment: CurrentInstallment,
                MaxInstallment: MaxInstallment,
                StartDate: currMoment.startOf("month").toDate(),
                ExpectedDate: currMoment.add((MaxInstallment - CurrentInstallment), "month").startOf("month").toDate(),
                Price: parseFloat(createExpenseData.Price.replace(",", "."))
            })
        }

        await new InstallmentExpensesUseCases(tx).update(installmentExpense.IdInstallmentExpense, {
            ExpectedDate: serverUtilsUseCases.getCurrMoment().subtract(1, "month").toDate()
        })

        return this.instance.CreateExpense.createInstallmentExpense(tx, BaseExpense.IdBaseExpense, createExpenseData, moment(installmentExpense.StartDate))
    }
}
