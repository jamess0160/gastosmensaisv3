import { UtilTypes } from "@/database/UtilTypes";
import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { usersAuthUseCases } from "@/useCases/UsersAuth/UsersAuthUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { usersauth } from "@prisma/client";
import { AuthenticationResponseJSON } from "@simplewebauthn/browser";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { NextRequest, NextResponse } from "next/server";

export class Authenticate {

    public async run(request: NextRequest) {
        let data = await request.json() as AuthenticationResponseJSON

        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let userCredential = await this.getUserCredential(data.id)

        let verification = await verifyAuthenticationResponse(await this.generateOptions(data, userCredential, session))

        if (verification.authenticationInfo && verification.verified) {
            await this.handleLogin(userCredential, verification.authenticationInfo.newCounter)
        }

        return NextResponse.json({ verified: verification.verified })
    }

    private async getUserCredential(token: string) {
        let userCredential = await usersAuthUseCases.getByToken(token)

        if (!userCredential) {
            throw new Error("userCredential não encontrado!")
        }

        return userCredential
    }

    private async generateOptions(data: AuthenticationResponseJSON, userCredential: usersauth, session: UtilTypes.Session) {

        if (!process.env.hostName) {
            throw new Error("process.env.hostName não encontrado!")
        }

        if (!process.env.origin) {
            throw new Error("process.env.origin não encontrado!")
        }

        if (!session.AuthChallenge) {
            throw new Error("AuthChallenge não encontrado!")
        }

        return {
            response: data,
            expectedChallenge: session.AuthChallenge,
            expectedOrigin: process.env.origin,
            credential: {
                id: userCredential.Token,
                counter: Number(userCredential.Counter),
                publicKey: userCredential.PublicKey
            },
            expectedRPID: process.env.hostName
        }
    }

    private async handleLogin(userCredential: usersauth, newCounter: number) {
        let userData = await usersUseCases.getById(userCredential.IdUser)

        if (!userData) {
            throw new Error("Usuário não encontrado!")
        }

        await usersAuthUseCases.update(userCredential.IdUserAuth, {
            Counter: newCounter,
        })

        await serverUtilsUseCases.Cookies.setSession({
            IdUser: userData.IdUser,
            UserName: userData.Name || "",
            IsMobile: true,
        })

        await serverUtilsUseCases.Cookies.setLastUser(userData.IdUser)
    }

}