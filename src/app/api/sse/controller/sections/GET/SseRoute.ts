import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";

export class SseRoute {
    public run() {
        return new Response(serverUtilsUseCases.SseEngine.getReadable(), {
            headers: {
                'Content-Type': 'text/event-stream',
                Connection: 'keep-alive',
                'Cache-Control': 'no-cache, no-transform',
            },
        });
    }
}