import { prisma } from '@/database/prisma'

type UpdateBank = Parameters<typeof prisma.banks.update>[0]['data']

export function update(IdBank: number, data: UpdateBank) {
    return prisma.banks.update({
        where: { IdBank },
        data: data
    })
}
