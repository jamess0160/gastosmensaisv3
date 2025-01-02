import { UtilTypes } from "@/database/UtilTypes";
import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { usersAuthUseCases } from "@/useCases/UsersAuth/UsersAuthUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { generateAuthenticationOptions, generateRegistrationOptions } from "@simplewebauthn/server";
import { NextRequest, NextResponse } from "next/server";

export class GetOptions {

    public async run(request: NextRequest) {
        let { searchParams } = new URL(request.url)
        let type = searchParams.get('type') as UtilTypes.WebAuthOptionTypes

        let IdUser = await this.getUserId()

        let userdata = await this.getUser(IdUser)

        if (!process.env.hostName) {
            throw new Error("process.env.hostName não encontrado!")
        }

        if (type === "register") {
            return NextResponse.json(await this.getRegisterOptions(`${IdUser} - ${userdata.Name}`, process.env.hostName))
        }

        if (type === "login") {
            return NextResponse.json(await this.getAuthOptions(IdUser, process.env.hostName))
        }

        return NextResponse.json({ msg: "Não foi passado nenhum type" }, { status: 500 })
    }

    private async getUserId() {
        let session = await serverUtilsUseCases.Cookies.getSession()
        let lastUser = await serverUtilsUseCases.Cookies.getLastUser()

        if (session && session.IdUser) {
            return session.IdUser
        }

        if (!lastUser) {
            throw new Error("IdUser não encontrado!")
        }

        return lastUser
    }

    private async getUser(IdUser: number) {
        let userdata = await usersUseCases.getById(IdUser)

        if (!userdata) {
            throw new Error("userdata não encontrado!")
        }

        return userdata
    }

    private async getRegisterOptions(userName: string, rpID: string) {
        let options = await generateRegistrationOptions({
            rpName: "Gastos mensais",
            rpID: rpID,
            userName: userName,
            attestationType: 'none',
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform',
            },
        })

        await serverUtilsUseCases.Cookies.setSession({ AuthChallenge: options.challenge })

        return options
    }

    private async getAuthOptions(IdUser: number, rpID: string) {
        let userPasskeys = await usersAuthUseCases.getByUser(IdUser)

        let options = await generateAuthenticationOptions({
            timeout: 60000,
            allowCredentials: userPasskeys.map(passkey => ({
                id: passkey.Token || "",
            })),
            userVerification: 'preferred',
            rpID,
        })

        await serverUtilsUseCases.Cookies.setSession({ AuthChallenge: options.challenge })

        return options
    }
}