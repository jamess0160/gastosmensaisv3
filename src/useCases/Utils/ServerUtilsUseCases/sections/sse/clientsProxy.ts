declare global {
    var SseProxy: undefined | SseProxy
}


class SseProxy {
    public readonly clients: Record<string, TransformStream> = {}
    public readonly keyCache: Record<string, (response: any) => void> = {}
}

function singleton() {
    return new SseProxy()
}

export const sseProxy = globalThis.SseProxy ?? singleton()

globalThis.SseProxy = sseProxy
