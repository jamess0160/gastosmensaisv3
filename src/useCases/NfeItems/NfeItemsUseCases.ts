import { BaseUseCase } from "@/base/baseUseCase";
import { prisma } from "@/database/prisma";

export class NfeItemsUseCases extends BaseUseCase {

    create(data: CreateData) {
        return this.prisma.nfeitems.create({ data })
    }

    update(IdNfeItem: number, data: UpdateData) {
        return this.prisma.nfeitems.update({
            where: { IdNfeItem },
            data: data
        })
    }

    remove(IdNfeItem: number) {
        return this.prisma.nfeitems.delete({
            where: { IdNfeItem }
        })
    }
}

export const nfeItemsUseCases = new NfeItemsUseCases()

type CreateData = Parameters<typeof prisma.nfeitems.create>['0']['data']

type UpdateData = Parameters<typeof prisma.nfeitems.update>['0']['data']