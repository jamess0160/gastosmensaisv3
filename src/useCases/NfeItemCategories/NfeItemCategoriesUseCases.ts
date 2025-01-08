import { BaseUseCase } from "@/base/baseUseCase";
import { prisma } from "@/database/prisma";

export class NfeItemCategoriesUseCases extends BaseUseCase {

    getAllByUser(IdUser: number) {
        return this.prisma.nfeitemcategories.findMany({
            where: { IdUser }
        })
    }

    getFirstBy(where: WhereArgs) {
        return this.prisma.nfeitemcategories.findFirst({ where })
    }

    getBy(where: WhereArgs) {
        return this.prisma.nfeitemcategories.findMany({ where })
    }

    create(data: CreateData) {
        return this.prisma.nfeitemcategories.create({ data })
    }

    update(IdNfeItemCategory: number, data: CreateData) {
        return this.prisma.nfeitemcategories.update({
            where: { IdNfeItemCategory },
            data: data
        })
    }

    remove(IdNfeItemCategory: number) {
        return this.prisma.nfeitemcategories.delete({
            where: { IdNfeItemCategory }
        })
    }
}

export const nfeItemCategoriesUseCases = new NfeItemCategoriesUseCases()

type WhereArgs = NonNullable<Parameters<typeof prisma.nfeitemcategories.findFirst>['0']>['where']

type CreateData = Parameters<typeof prisma.nfeitemcategories.create>['0']['data']