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
}

export const destinysUseCases = new DestinysUseCases()

type WhereArgs = NonNullable<Parameters<typeof prisma.destinys.findFirst>['0']>['where']