import { CreateTypes } from "@/database/CreateTypes"
import { cashInflowDestinysUseCases } from "@/useCases/CashInflowDestinys/CashInflowDestinysUseCases"
import { CreateCashInFlow, cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases"
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases"
import { NextResponse } from "next/server"

export class Update {
    public async run(data: CreateTypes.CreateCashInflow) {
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        if (!data.IdCashInflow) return NextResponse.json({ msg: "Propriedade IdCashInflow não encontrada!" }, { status: 500 })

        await cashInflowDestinysUseCases.deleteExpenseChilds(data.IdCashInflow)

        return NextResponse.json(await cashInflowsUseCases.update(data.IdCashInflow, this.handleUpdateData(data, Number(IdUser))))
    }

    private handleUpdateData(data: CreateTypes.CreateCashInflow, IdUser: number): CreateCashInFlow {
        let currMoment = serverUtilsUseCases.getCurrMoment()

        return {
            Description: data.Description,
            EfectiveDate: currMoment.toDate(),
            Value: parseFloat(data.Value.replace(",", ".")),
            IdUser: IdUser,
            cashinflowdestinys: {
                createMany: {
                    data: data.IdsDestinys.map((item) => {
                        return {
                            IdDestiny: Number(item)
                        }
                    })
                }
            }
        }
    }
}