import { BaseUseCase } from "@/base/baseUseCase";
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases";
import type { prisma } from "@/database/prisma";

export class CashInflowsUseCases extends BaseUseCase {

    getAllByMY(month: number, year: number) {
        return this.prisma.cashinflows.findMany({
            where: {
                EfectiveDate: {
                    gte: clientUtilsUseCases.monthAndYearToMoment(month, year).toDate(),
                    lt: clientUtilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
                }
            }
        })
    }

    async clone(month: number, year: number) {
        let effectiveCashInflows = await this.getAllByMY(month, year)

        return this.createMany(effectiveCashInflows.map((item) => {
            return {
                Description: item.Description,
                IdDestiny: item.IdDestiny,
                Value: item.Value,
                EfectiveDate: new Date(),
            }
        }))
    }

    create(data: CreateCashInFlow) {
        return this.prisma.cashinflows.create({ data })
    }

    createMany(data: CreateCashInFlow[]) {
        return this.prisma.cashinflows.createMany({ data })
    }

    update(IdCashInflow: number, data: UpdateCashInFlow) {
        return this.prisma.cashinflows.update({
            where: { IdCashInflow },
            data: data
        })
    }

    remove(IdCashInflow: number) {
        return this.prisma.cashinflows.delete({
            where: { IdCashInflow }
        })
    }

}

export const cashInflowsUseCases = new CashInflowsUseCases()

//#region Interfaces / Types 

type CreateCashInFlow = Parameters<typeof prisma.cashinflows.create>[0]['data']

type UpdateCashInFlow = Parameters<typeof prisma.cashinflows.update>[0]['data']

//#endregion
