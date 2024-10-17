import { BaseUseCase } from "@/base/baseUseCase";

export class ExpenseCategoriesUseCases extends BaseUseCase {
    getAllByUser(IdUser: number) {
        return this.prisma.expensecategories.findMany({
            where: { IdUser }
        })
    }
}

export const expenseCategoriesUseCases = new ExpenseCategoriesUseCases()