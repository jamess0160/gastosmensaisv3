import { CreateTypes } from "@/database/CreateTypes"
import { CreateCashInFlow, cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases"
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases"
import { NextResponse } from "next/server"

export class Create {
    public async run(data: CreateTypes.CreateCashInflow) {
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        return NextResponse.json(await cashInflowsUseCases.create(this.handleCreateData(data, Number(IdUser))))
    }

    private handleCreateData(data: CreateTypes.CreateCashInflow, IdUser: number): CreateCashInFlow {
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