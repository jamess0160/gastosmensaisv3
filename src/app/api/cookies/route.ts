import { UtilTypes } from "@/database/UtilTypes";
import { NextRequest } from "next/server";
import { cookiesController } from "./controller/controller";

export async function POST(request: NextRequest) {
    let data = await request.json() as UtilTypes.CookiesPostBody

    return cookiesController.SetMonthYear.run(data)
}