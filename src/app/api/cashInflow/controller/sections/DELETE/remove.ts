import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases"
import { NextRequest, NextResponse } from "next/server"

export class Remove {
    public async run(request: NextRequest) {
        let { searchParams } = new URL(request.url)

        let IdCashInflow = searchParams.get('IdCashInflow')

        if (!IdCashInflow) {
            return NextResponse.json({ msg: "IdCashInflow não encontrado na query!" }, { status: 406 })
        }

        return NextResponse.json(await cashInflowsUseCases.delete(parseInt(IdCashInflow)))
    }
}