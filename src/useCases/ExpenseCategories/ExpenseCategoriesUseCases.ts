import { BaseUseCase } from "@/base/baseUseCase";
import { prisma } from "@/database/prisma";

export class ExpenseCategoriesUseCases extends BaseUseCase {
    getAllByUser(IdUser: number) {
        return this.prisma.expensecategories.findMany({
            where: { IdUser },
            orderBy: { Position: "asc" }
        })
    }

    create(data: CreateData) {
        return this.prisma.expensecategories.create({ data })
    }

    update(IdExpenseCategory: number, data: CreateData) {
        return this.prisma.expensecategories.update({
            where: { IdExpenseCategory },
            data: data
        })
    }

    remove(IdExpenseCategory: number) {
        return this.prisma.expensecategories.delete({
            where: { IdExpenseCategory }
        })
    }
}

export const expenseCategoriesUseCases = new ExpenseCategoriesUseCases()

type CreateData = Parameters<typeof prisma.expensecategories.create>['0']['data']