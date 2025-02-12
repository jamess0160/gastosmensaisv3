import { SseRoute } from "./sections/GET/SseRoute"
import { Response } from "./sections/POST/response"

class Controller {
    public readonly SseRoute = new SseRoute()
    public readonly Response = new Response()
}

export const SseController = new Controller()