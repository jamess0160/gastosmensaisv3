import { prisma } from '@/database/prisma'

type UpdateCashInFlow = Parameters<typeof prisma.cashinflows.update>[0]['data']

export function update(IdCashInflow: number, data: UpdateCashInFlow) {
    return prisma.cashinflows.update({
        where: { IdCashInflow },
        data: data
    })
}
