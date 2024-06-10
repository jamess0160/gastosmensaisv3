import { socketUseCases } from '@/useCases/Socket/SocketUseCases'
import { PrismaClient } from '@prisma/client'

declare global {
    var singleTon_Prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

function prismaClientSingleton() {
    return new PrismaClient().$extends({
        query: {
            $allModels: {
                $allOperations: async (data) => {
                    let result = await data.query(data.args)

                    if (data.operation.includes("find") === false) {
                        socketUseCases.emmitReloadRequest("/inicio")
                        socketUseCases.emmitReloadRequest("/categorias")
                    }

                    return result
                }
            }
        }
    })
}

export const prisma = globalThis.singleTon_Prisma ?? prismaClientSingleton()

globalThis.singleTon_Prisma = prisma