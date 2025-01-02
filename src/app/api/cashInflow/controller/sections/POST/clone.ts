import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases"
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases"
import { NextResponse } from "next/server"

export class Clone {
    public async run() {
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        let currMoment = serverUtilsUseCases.getCurrMoment()
        let lastMoment = currMoment.subtract(1, "month")
        let month = lastMoment.get("month")
        let year = lastMoment.get("year")

        await cashInflowsUseCases.clone(month, year, Number(IdUser))

        return NextResponse.json({ msg: "Sucesso!" })
    }
}