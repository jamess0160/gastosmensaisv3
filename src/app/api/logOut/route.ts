import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextResponse } from "next/server";

export function POST() {
    serverUtilsUseCases.clearSession()

    return NextResponse.json({ success: true })
}