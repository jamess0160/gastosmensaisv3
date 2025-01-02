import { CreateTypes } from "@/database/CreateTypes";
import { cashInflowDestinysUseCases } from "@/useCases/CashInflowDestinys/CashInflowDestinysUseCases";
import { CreateCashInFlow, cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let data = await request.json() as CreateTypes.CreateCashInflow
    let session = await serverUtilsUseCases.Cookies.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    let { IdUser } = session

    return NextResponse.json(await cashInflowsUseCases.create(handleCreateData(data, Number(IdUser))))
}

export async function PUT(request: NextRequest) {
    let data = await request.json() as CreateTypes.CreateCashInflow
    let session = await serverUtilsUseCases.Cookies.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    let { IdUser } = session

    if (!data.IdCashInflow) return NextResponse.json({ msg: "Propriedade IdCashInflow não encontrada!" })

    await cashInflowDestinysUseCases.deleteExpenseChilds(data.IdCashInflow)

    return NextResponse.json(await cashInflowsUseCases.update(data.IdCashInflow, handleCreateData(data, Number(IdUser))))
}

function handleCreateData(data: CreateTypes.CreateCashInflow, IdUser: number): CreateCashInFlow {
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

export async function DELETE(request: NextRequest) {
    let { searchParams } = new URL(request.url)
    let IdCashInflow = searchParams.get('IdCashInflow')

    if (!IdCashInflow) {
        return NextResponse.json({ msg: "IdCashInflow não encontrado na query!" }, { status: 406 })
    }

    return NextResponse.json(await cashInflowsUseCases.delete(parseInt(IdCashInflow)))
}