import { prisma } from '@/database/prisma'

type SistemParams = "ValorMaximoGeral" | "IdDestinoConjunto" | "IdDestinoGeral"

export function getParam(paramName: SistemParams, EfectiveDate: Date) {
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