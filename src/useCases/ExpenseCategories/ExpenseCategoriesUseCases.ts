import { BaseUseCase } from "@/base";

export class ExpenseCategoriesUseCases extends BaseUseCase {
    getAll() {
        return this.prisma.expensecategories.findMany()
    }
}

export const expenseCategoriesUseCases = new ExpenseCategoriesUseCases()