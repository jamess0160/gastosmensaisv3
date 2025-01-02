import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases"
import { NextResponse } from "next/server"

export class LogOut {
    public async run() {
        serverUtilsUseCases.Cookies.clearSession()

        return NextResponse.json({ success: true })
    }
}