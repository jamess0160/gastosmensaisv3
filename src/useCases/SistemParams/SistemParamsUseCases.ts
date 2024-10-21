import { BaseUseCase } from "../../base/baseUseCase";
import { sistemparams } from '@prisma/client'
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases";
import moment from "moment";

export class SistemParamsUseCases extends BaseUseCase {

    private readonly oSistemParams = {
        ValorMaximoGeral: "ValorMaximoGeral",
        IdDestinoConjunto: "IdDestinoConjunto",
        IdDestinoGeral: "IdDestinoGeral",
    }

    async getAll(month: number, year: number, IdUser: number) {
        let date = moment().set("month", month).set("year", year).startOf("month")
        let params = await this.prisma.$queryRaw<sistemparams[]>`
            SELECT
                *
            FROM
                sistemparams
            WHERE
                IdSistemParam IN (
                    SELECT
                        MAX(IdSistemParam)
                    FROM
                        sistemparams
                    WHERE
                        EfectiveDate <= ${date.toDate()}
                        AND IdUser = ${IdUser}
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

    getParam(paramName: SistemParams, month: number, year: number) {
        return this.prisma.sistemparams.findFirst({
            where: {
                Key: paramName,
                EfectiveDate: {
                    lte: clientUtilsUseCases.monthAndYearToMoment(month, year).endOf("month").toDate()
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
