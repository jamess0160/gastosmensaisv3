import { BaseUseCase } from "@/base/baseUseCase";

export class ExpenseCategoriesUseCases extends BaseUseCase {
    getAll() {
        return this.prisma.expensecategories.findMany()
    }
}

export const expenseCategoriesUseCases = new ExpenseCategoriesUseCases()