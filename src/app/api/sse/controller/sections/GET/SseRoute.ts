import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextResponse } from "next/server";

export class SseRoute {
    public async run() {

        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return NextResponse.json({ msg: "usuário não logado!" })
        }

        return new Response(serverUtilsUseCases.SseEngine.addClient(session.IdUser), {
            headers: {
                'Content-Type': 'text/event-stream',
                Connection: 'keep-alive',
                'Cache-Control': 'no-cache, no-transform',
            },
        });
    }
}