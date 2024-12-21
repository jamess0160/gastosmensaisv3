import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let IdUser = request.headers.get("IdUser")

    let currMoment = serverUtilsUseCases.getCurrMoment()
    let lastMoment = currMoment.subtract(1, "month")
    let month = lastMoment.get("month")
    let year = lastMoment.get("year")

    await cashInflowsUseCases.clone(month, year, Number(IdUser))

    revalidatePath("/config")

    return NextResponse.json({ msg: "Sucesso!" })
}