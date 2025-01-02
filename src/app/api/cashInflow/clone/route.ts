import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST() {
    let session = await serverUtilsUseCases.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    let { IdUser } = session

    let currMoment = serverUtilsUseCases.getCurrMoment()
    let lastMoment = currMoment.subtract(1, "month")
    let month = lastMoment.get("month")
    let year = lastMoment.get("year")

    await cashInflowsUseCases.clone(month, year, Number(IdUser))

    revalidatePath("/config")

    return NextResponse.json({ msg: "Sucesso!" })
}