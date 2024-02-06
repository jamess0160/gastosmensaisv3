import { prisma } from '@/database/prisma'

export function getParam(paramName: string, EfectiveDate: Date) {
    return prisma.sistemparams.findFirst({
        where: {
            Key: paramName,
            EfectiveDate: {
                gte: EfectiveDate
            }
        },
        orderBy: {
            IdSistemParam: "desc"
        }
    })
}
