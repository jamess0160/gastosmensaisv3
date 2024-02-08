import { prisma } from '@/database/prisma'

export function remove(IdBank: number) {
    return prisma.banks.delete({
        where: { IdBank }
    })
}
