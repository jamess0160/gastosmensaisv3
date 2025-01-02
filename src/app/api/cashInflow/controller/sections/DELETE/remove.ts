import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases"
import { NextResponse } from "next/server"

export class Remove {
    public async run(searchParams: URLSearchParams) {
        let IdCashInflow = searchParams.get('IdCashInflow')

        if (!IdCashInflow) {
            return NextResponse.json({ msg: "IdCashInflow não encontrado na query!" }, { status: 406 })
        }

        return NextResponse.json(await cashInflowsUseCases.delete(parseInt(IdCashInflow)))
    }
}