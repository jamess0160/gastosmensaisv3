import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export class Response {
    public async run(request: NextRequest) {
        let data = await request.json() as SsePayload

        serverUtilsUseCases.SseEngine.sendConfirmation(data.key, data.response)

        return NextResponse.json({ msg: "Sucesso!" })
    }
}

interface SsePayload {
    key: string
    response: boolean
}