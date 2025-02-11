import { BaseUseCase } from "@/base/baseUseCase";
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { serverUtilsUseCases } from "../Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { prisma } from '@/database/prisma'

export class CashInflowsUseCases extends BaseUseCase {

    getAllByMY(month: number, year: number, IdUser: number) {
        return this.prisma.cashinflows.findMany({
            where: {
                EfectiveDate: {
                    gte: clientUtilsUseCases.monthAndYearToMoment(month, year).subtract(3, "hours").toDate(),
                    lt: clientUtilsUseCases.monthAndYearToMoment(month, year).subtract(3, "hours").add(1, 'month').toDate(),
                },
                IdUser
            },
            include: {
                cashinflowdestinys: {
                    include: {
                        destinys: true
                    }
                }
            }
        })
    }

    async clone(month: number, year: number, IdUser: number) {
        let effectiveCashInflows = await this.getAllByMY(month, year, IdUser)

        return this.createMany(effectiveCashInflows.map((item) => {
            return {
                Description: item.Description,
                Value: item.Value,
                EfectiveDate: serverUtilsUseCases.getCurrMoment().toDate(),
                IdUser: item.IdUser,
                cashinflowdestinys: {
                    createMany: {
                        data: item.cashinflowdestinys.map((item) => {
                            return {
                                IdDestiny: item.IdDestiny
                            }
                        })
                    }
                }
            }
        }))
    }

    create(data: CreateCashInFlow) {
        return this.prisma.cashinflows.create({ data })
    }

    createMany(data: CreateCashInFlow[]) {
        return prisma.$transaction(data.map((item) => {
            return prisma.cashinflows.create({ data: item })
        }))
    }

    update(IdCashInflow: number, data: UpdateCashInFlow) {
        return this.prisma.cashinflows.update({
            where: { IdCashInflow },
            data: data
        })
    }

    delete(IdCashInflow: number) {
        return this.prisma.cashinflows.delete({
            where: { IdCashInflow }
        })
    }

}

export const cashInflowsUseCases = new CashInflowsUseCases()

//#region Interfaces / Types 

export type CreateCashInFlow = Parameters<typeof prisma.cashinflows.create>[0]['data']

type UpdateCashInFlow = Parameters<typeof prisma.cashinflows.update>[0]['data']

export type CashInflowMY = Awaited<ReturnType<InstanceType<typeof CashInflowsUseCases>['getAllByMY']>>[0]

//#endregion
