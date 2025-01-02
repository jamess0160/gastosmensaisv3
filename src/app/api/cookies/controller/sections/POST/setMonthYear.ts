import { UtilTypes } from "@/database/UtilTypes"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export class SetMonthYear {
    public async run(request: NextRequest) {
        let data = await request.json() as UtilTypes.CookiesPostBody

        cookies().set("month", data.month || new Date().getMonth().toString())
        cookies().set("year", data.year || new Date().getFullYear().toString())

        return NextResponse.json({ msg: "Sucesso!" })
    }
}