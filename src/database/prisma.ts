import { PrismaClient } from '@prisma/client'

declare global {
    var singleTon_Prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

function prismaClientSingleton() {
    return new PrismaClient()
}

export const prisma = globalThis.singleTon_Prisma ?? prismaClientSingleton()

globalThis.singleTon_Prisma = prisma