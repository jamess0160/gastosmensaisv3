import { BaseUseCase } from "@/base/baseUseCase";
import { prisma } from "@/database/prisma";

export class DestinysUseCases extends BaseUseCase {
    getAllByUser(IdUser: number) {
        return this.prisma.destinys.findMany({
            where: { IdUser }
        })
    }

    getFirstBy(where: WhereArgs) {
        return this.prisma.destinys.findFirst({ where })
    }

    getBy(where: WhereArgs) {
        return this.prisma.destinys.findMany({ where })
    }

    create(data: CreateData) {
        return this.prisma.destinys.create({ data })
    }

    update(IdDestiny: number, data: CreateData) {
        return this.prisma.destinys.update({
            where: { IdDestiny },
            data: data
        })
    }

    remove(IdDestiny: number) {
        return this.prisma.destinys.delete({
            where: { IdDestiny }
        })
    }
}

export const destinysUseCases = new DestinysUseCases()

type WhereArgs = NonNullable<Parameters<typeof prisma.destinys.findFirst>['0']>['where']

type CreateData = Parameters<typeof prisma.destinys.create>['0']['data']