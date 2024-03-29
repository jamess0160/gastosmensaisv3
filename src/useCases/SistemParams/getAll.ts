import { prisma } from '@/database/prisma'

const oSistemParams = {
    ValorMaximoGeral: "ValorMaximoGeral",
    IdDestinoConjunto: "IdDestinoConjunto",
    IdDestinoGeral: "IdDestinoGeral",
}

type SistemParams = keyof typeof oSistemParams

export type getParamReturn = Awaited<ReturnType<typeof getAll>>

export async function getAll(EfectiveDate: Date) {
    let params = await prisma.sistemparams.findMany({
        where: {
            EfectiveDate: {
                gte: EfectiveDate
            }
        },
        orderBy: {
            IdSistemParam: "desc"
        }
    })

    let keys = Object.keys(oSistemParams) as SistemParams[]

    return keys.reduce<Record<SistemParams, string>>((old, key) => {

        let param = params.find((item) => item.Key === key)

        if (param) {
            old[key] = param.Value
        }

        return old
    }, {} as Record<SistemParams, string>)
}