import { prisma } from '@/database/prisma'
import { sistemparams } from '@prisma/client'
import { UtilsUseCases } from '../Utils/UtilsUseCases'

const oSistemParams = {
    ValorMaximoGeral: "ValorMaximoGeral",
    IdDestinoConjunto: "IdDestinoConjunto",
    IdDestinoGeral: "IdDestinoGeral",
}

type SistemParams = keyof typeof oSistemParams

export type getParamReturn = Awaited<ReturnType<typeof getAll>>

export async function getAll(month: number, year: number) {
    let EfectiveDate = UtilsUseCases.monthAndYearToMoment(month, year).toDate()
    let params = await prisma.$queryRaw<sistemparams[]>`
                SELECT
                    *
                FROM
                    SistemParams
                WHERE
                    IdSistemParam IN (
                        SELECT
                            MAX(IdSistemParam)
                        FROM
                            SistemParams
                        WHERE
                            EfectiveDate <= ${EfectiveDate}
                        GROUP BY
                            \`Key\`
                    )
        `

    let keys = Object.keys(oSistemParams) as SistemParams[]

    return keys.reduce<Record<SistemParams, string>>((old, key) => {

        let param = params.find((item) => item.Key === key)

        if (param) {
            old[key] = param.Value
        }

        return old
    }, {} as Record<SistemParams, string>)
}