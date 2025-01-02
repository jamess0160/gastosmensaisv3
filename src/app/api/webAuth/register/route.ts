import { prisma } from "@/database/prisma";
import { UsersUseCases } from "@/useCases/Users/UsersUseCases";
import { UsersAuthUseCases } from "@/useCases/UsersAuth/UsersAuthUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { RegistrationResponseJSON } from "@simplewebauthn/browser";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    let data = await request.json() as RegistrationResponseJSON

    let session = await serverUtilsUseCases.Cookies.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    if (!session.AuthChallenge) {
        throw new Error("AuthChallenge não encontrado!")
    }

    if (!process.env.origin) {
        throw new Error("process.env.origin não encontrado!")
    }

    let verification = await verifyRegistrationResponse({
        response: data,
        expectedChallenge: session.AuthChallenge,
        expectedOrigin: process.env.origin,
    })

    let DeviceKey = crypto.randomBytes(40).toString("base64")

    if (verification.registrationInfo && verification.verified) {

        let credential = verification.registrationInfo.credential

        await prisma.$transaction(async (tx) => {
            const usersAuthUseCases = new UsersAuthUseCases(tx)
            const usersUseCases = new UsersUseCases(tx)

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

            await usersUseCases.update(session.IdUser, { UseAuth: true })
        })

    }

    return NextResponse.json({ verified: verification.verified, DeviceKey })
}