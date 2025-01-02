import { SignJWT, jwtVerify } from 'jose'

export class CriptManager {
    public async cript(data: Record<string, any>): Promise<string> {

        return new SignJWT(data)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(this.getSecret())
    }

    public async decript<T>(cript: string): Promise<T> {

        let { payload } = await jwtVerify(cript, this.getSecret(), {
            algorithms: ['HS256'],
        })

        return payload as T
    }

    private getSecret() {
        if (!process.env.secret) {
            throw new Error("process.env.secret não configurada")
        }

        return new TextEncoder().encode(process.env.secret)
    }
}