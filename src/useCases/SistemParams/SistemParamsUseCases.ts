import { BaseUseCase } from "../../base";
import { sistemparams } from '@prisma/client'
import { utilsUseCases } from "../Utils/UtilsUseCases";

export class SistemParamsUseCases extends BaseUseCase {

    private readonly oSistemParams = {
        ValorMaximoGeral: "ValorMaximoGeral",
        IdDestinoConjunto: "IdDestinoConjunto",
        IdDestinoGeral: "IdDestinoGeral",
    }

    async getAll(month: number, year: number) {
        let EfectiveDate = utilsUseCases.monthAndYearToMoment(month, year).toDate()

        let params = await this.prisma.$queryRaw<sistemparams[]>`
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

        let keys = Object.keys(this.oSistemParams) as SistemParams[]

        return keys.reduce<Record<SistemParams, string>>((old, key) => {

            let param = params.find((item) => item.Key === key)

            if (param) {
                old[key] = param.Value
            }

            return old
        }, {} as Record<SistemParams, string>)
    }

    getParam(paramName: SistemParams, EfectiveDate: Date) {
        return this.prisma.sistemparams.findFirst({
            where: {
                Key: paramName,
                EfectiveDate: {
                    gte: EfectiveDate
                }
            },
            orderBy: {
                IdSistemParam: "desc"
            }
        })
    }
}

export const sistemParamsUseCases = new SistemParamsUseCases()

//#region Interfaces / Types 

type ClassType = InstanceType<typeof SistemParamsUseCases>

type SistemParams = keyof ClassType['oSistemParams']

export type getParamReturn = Awaited<ReturnType<ClassType['getAll']>>

//#endregion
