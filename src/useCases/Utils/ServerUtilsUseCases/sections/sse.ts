import crypto from 'crypto'

export class SseEngine {

    private readonly ResponseStream = new TransformStream()

    private readonly keyCache: Record<string, (response: boolean) => void> = {}

    public getReadable() {
        return this.ResponseStream.readable
    }

    public getConfirmation(message: string) {
        let writer = this.ResponseStream.writable.getWriter()
        let key = this.getKey()

        writer.write(`data: ${JSON.stringify({ message, key: key })}\n\n`)

        return new Promise((resolve) => {
            this.keyCache[key] = (response: boolean) => {
                resolve(response)
                delete this.keyCache[key]
            }
        })
    }

    public sendConfirmation(key: string, response: boolean) {
        if (!this.keyCache[key]) {
            return
        }

        return this.keyCache[key](response)
    }

    private getKey(): string {
        let key = crypto.randomBytes(40).toString("base64")

        if (this.keyCache[key]) {
            return this.getKey()
        }

        return key
    }
}