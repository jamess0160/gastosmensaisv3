import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var singleTon_Prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.singleTon_Prisma ?? prismaClientSingleton()

globalThis.singleTon_Prisma = prisma