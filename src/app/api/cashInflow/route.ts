import { CreateTypes } from "@/database/CreateTypes";
import { CreateCashInFlow, cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let data = await request.json() as CreateTypes.CreateCashInflow
    let IdUser = request.headers.get("IdUser")

    return NextResponse.json(await cashInflowsUseCases.create(handleCreateData(data, Number(IdUser))))
}

export async function PUT(request: NextRequest) {
    let data = await request.json() as CreateTypes.CreateCashInflow
    let IdUser = request.headers.get("IdUser")

    if (!data.IdCashInflow) return NextResponse.json({ msg: "Propriedade IdCashInflow não encontrada!" })

    return NextResponse.json(await cashInflowsUseCases.update(data.IdCashInflow, handleCreateData(data, Number(IdUser))))
}

function handleCreateData(data: CreateTypes.CreateCashInflow, IdUser: number): CreateCashInFlow {
    let currMoment = serverUtilsUseCases.getCurrMoment()

    return {
        Description: data.Description,
        EfectiveDate: currMoment.toDate(),
        IdDestiny: parseInt(data.IdDestiny),
        Value: parseFloat(data.Value.replace(",", ".")),
        IdUser: IdUser
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