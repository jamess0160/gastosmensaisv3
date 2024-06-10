import { prisma } from "@/database/prisma"
import { UtilTypes } from "../database/UtilTypes"

export abstract class BaseUseCase {
    public readonly prisma: UtilTypes.PrismaTransaction

    constructor(tx?: UtilTypes.PrismaTransaction) {
        this.prisma = tx || prisma
    }
}