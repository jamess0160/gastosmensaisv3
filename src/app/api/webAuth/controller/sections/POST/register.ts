import { usersAuthUseCases } from "@/useCases/UsersAuth/UsersAuthUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { RegistrationResponseJSON } from "@simplewebauthn/browser";
import { WebAuthnCredential, verifyRegistrationResponse } from "@simplewebauthn/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'
import { UtilTypes } from "@/database/UtilTypes";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";

export class Register {

    public async run(request: NextRequest) {

        let { searchParams } = new URL(request.url)
        let DeviceKey = searchParams.get('DeviceKey') as string

        let { data, session } = await clientUtilsUseCases.resolvePromiseObj({
            data: (request.json() as Promise<RegistrationResponseJSON>),
            session: serverUtilsUseCases.Cookies.getSession(),
        })

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let verification = await verifyRegistrationResponse(this.generateOptions(data, session))

        if (!verification.verified || !verification.registrationInfo) {
            return NextResponse.json({ verified: verification.verified })
        }

        return NextResponse.json(await this.handleRegister(verification.registrationInfo.credential, session, DeviceKey))
    }

    private generateOptions(data: RegistrationResponseJSON, session: UtilTypes.Session) {

        if (!session.AuthChallenge) {
            throw new Error("AuthChallenge não encontrado!")
        }

        if (!process.env.origin) {
            throw new Error("process.env.origin não encontrado!")
        }

        return {
            response: data,
            expectedChallenge: session.AuthChallenge,
            expectedOrigin: process.env.origin,
        }
    }

    private async handleRegister(credential: WebAuthnCredential, session: UtilTypes.Session, currentDevice?: string) {
        let DeviceKey = currentDevice || crypto.randomBytes(40).toString("base64")

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        await usersAuthUseCases.create({
            Token: credential.id,
            Counter: credential.counter,
            IdUser: session.IdUser,
            PublicKey: Buffer.from(credential.publicKey),
            DeviceKey: DeviceKey
        })

        return { verified: true, DeviceKey }
    }
}