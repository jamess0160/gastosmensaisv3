import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let { month, year } = serverUtilsUseCases.getMonthYear()
    let IdUser = request.headers.get("IdUser")

    await cashInflowsUseCases.clone(month - 1, year, Number(IdUser))

    revalidatePath("/config")

    return NextResponse.json({ msg: "Sucesso!" })
}