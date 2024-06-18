import { PrismaClient } from '@prisma/client'
import moment from 'moment'

declare global {
    var singleTon_Prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

function prismaClientSingleton() {
    return new PrismaClient().$extends({
        query: {
            async $allOperations({ args, operation, query }) {
                let result = await query(args)

                if (operation.includes("find")) {
                    return afterWare(result)
                }

                return result
            }
        }
    })
}

function afterWare(result: any[]) {
    return result.map((item) => {
        return formatDataType(item)
    })
}

function formatDataType(data: Record<string, any>) {

    Object.keys(data).forEach((key) => {
        if (data[key] instanceof Date) {
            data[key] = moment(data[key]).add(3, "hours").toDate()
            return
        }

        if (data[key] && typeof data[key] === "object") {
            data[key] = formatDataType(data[key])
            return
        }
    })

    return data
}

export const prisma = globalThis.singleTon_Prisma ?? prismaClientSingleton()

// globalThis.singleTon_Prisma = prisma