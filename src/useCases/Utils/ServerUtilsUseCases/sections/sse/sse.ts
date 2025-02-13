import crypto from 'crypto'
import { sseProxy } from './clientsProxy'

export class SseEngine {

    public addClient(IdUser: number) {
        const responseStream = new TransformStream()
        sseProxy.clients[IdUser] = responseStream
        return responseStream.readable
    }

    public removeClient(IdUser: number) {
        delete sseProxy.clients[IdUser]
    }

    public getConfirmation<T>(IdUser: number, type: string, data: any): Promise<T> {

        let clientStream = sseProxy.clients[IdUser]

        if (!clientStream) {
            throw new Error(`Stream para usuário #${IdUser} não encontrada!`)
        }

        let writer = clientStream.writable.getWriter()

        let key = this.getKey()

        writer.write(`data: ${JSON.stringify({ data, key, type })}\n\n`)

        writer.releaseLock()

        return new Promise((resolve) => {
            sseProxy.keyCache[key] = (response: T) => {
                resolve(response)
                delete sseProxy.keyCache[key]
            }
        })
    }

    public sendConfirmation(key: string, response: boolean) {
        if (!sseProxy.keyCache[key]) {
            return
        }

        return sseProxy.keyCache[key](response)
    }

    private getKey(): string {
        let key = crypto.randomBytes(40).toString("base64")

        if (sseProxy.keyCache[key]) {
            return this.getKey()
        }

        return key
    }
}