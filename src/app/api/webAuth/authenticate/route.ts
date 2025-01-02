import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { usersAuthUseCases } from "@/useCases/UsersAuth/UsersAuthUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { AuthenticationResponseJSON } from "@simplewebauthn/browser";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let data = await request.json() as AuthenticationResponseJSON

    let session = await serverUtilsUseCases.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    if (!session.AuthChallenge) {
        throw new Error("AuthChallenge não encontrado!")
    }

    let userCredential = await usersAuthUseCases.getByToken(data.id)

    if (!userCredential) {
        throw new Error("userCredential não encontrado!")
    }

    let verification = await verifyAuthenticationResponse({
        response: data,
        expectedChallenge: session.AuthChallenge,
        expectedOrigin: request.nextUrl.origin,
        credential: {
            id: userCredential.Token,
            counter: Number(userCredential.Counter),
            publicKey: userCredential.PublicKey
        },
        expectedRPID: request.nextUrl.hostname
    })

    if (verification.authenticationInfo && verification.verified) {

        await usersAuthUseCases.update(userCredential.IdUserAuth, {
            Counter: verification.authenticationInfo.newCounter,
        })

        let userData = await usersUseCases.getById(userCredential.IdUser)

        if (!userData) {
            throw new Error("Usuário não encontrado!")
        }

        await serverUtilsUseCases.setSession({
            IdUser: userData.IdUser,
            UserName: userData.Name || "",
            UserAuth: userData.UseAuth,
        })
    }

    return NextResponse.json({ verified: verification.verified })
}