import type { prisma } from "@/database/prisma";
import { BaseUseCase } from "../../base/baseUseCase";

export class InstallmentExpensesUseCases extends BaseUseCase {

    getFirstByBaseExpense(IdBaseExpenses: number[]) {
        return this.prisma.installmentexpenses.findFirst({
            where: {
                IdBaseExpense: { in: IdBaseExpenses }
            },
            orderBy: {
                IdInstallmentExpense: "desc"
            }
        })
    }

    create(data: CreateInstallmentExpenses) {
        return this.prisma.installmentexpenses.create({ data })
    }

    update(IdInstallmentExpense: number, data: UpdateInstallmentExpenses) {
        return this.prisma.installmentexpenses.update({
            where: { IdInstallmentExpense },
            data: data
        })
    }

    remove(IdInstallmentExpense: number) {
        return this.prisma.installmentexpenses.delete({
            where: { IdInstallmentExpense }
        })
    }

}

export const installmentExpensesUseCases = new InstallmentExpensesUseCases()

//#region Interfaces / Types 

type CreateInstallmentExpenses = Parameters<typeof prisma.installmentexpenses.create>[0]['data']

type UpdateInstallmentExpenses = Parameters<typeof prisma.installmentexpenses.update>[0]['data']

//#endregion
