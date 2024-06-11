import { UtilTypes } from "@/database/UtilTypes";
import { CreateCashInFlow, cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let data = await request.json() as UtilTypes.CreateCashInflow

    return NextResponse.json(await cashInflowsUseCases.create(handleCreateData(data)))
}

export async function PUT(request: NextRequest) {
    let data = await request.json() as UtilTypes.CreateCashInflow

    if (!data.IdCashInflow) return NextResponse.json({ msg: "Propriedade IdCashInflow não encontrada!" })

    return NextResponse.json(await cashInflowsUseCases.update(data.IdCashInflow, handleCreateData(data)))
}

function handleCreateData(data: UtilTypes.CreateCashInflow): CreateCashInFlow {
    let currMoment = serverUtilsUseCases.getCurrMoment()

    return {
        Description: data.Description,
        EfectiveDate: currMoment.toDate(),
        IdDestiny: parseInt(data.IdDestiny),
        Value: parseFloat(data.Value)
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