import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
    let { month, year } = serverUtilsUseCases.getMonthYear()

    await cashInflowsUseCases.clone(month - 1, year)

    revalidatePath("/config")

    return NextResponse.json({ msg: "Sucesso!" })
}