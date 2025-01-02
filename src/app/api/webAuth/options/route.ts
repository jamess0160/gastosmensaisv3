import { UtilTypes } from "@/database/UtilTypes";
import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { usersAuthUseCases } from "@/useCases/UsersAuth/UsersAuthUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { generateAuthenticationOptions, generateRegistrationOptions } from "@simplewebauthn/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    let { searchParams } = new URL(request.url)
    let type = searchParams.get('type') as UtilTypes.WebAuthOptionTypes

    let IdUser = await getUserId()

    if (!IdUser) {
        throw new Error("IdUser não encontrado!")
    }

    let userdata = await usersUseCases.getById(IdUser)

    if (!userdata) {
        throw new Error("userdata não encontrado!")
    }

    if (!process.env.hostName) {
        throw new Error("process.env.hostName não encontrado!")
    }

    if (type === "register") {
        return NextResponse.json(await getRegisterOptions(`${IdUser} - ${userdata.Name}`, process.env.hostName))
    }

    if (type === "login") {
        return NextResponse.json(await getAuthOptions(IdUser, process.env.hostName))
    }

    return NextResponse.json({ msg: "Não foi passado nenhum type" }, { status: 500 })
}

async function getUserId() {
    let session = await serverUtilsUseCases.Cookies.getSession()
    let lastUser = await serverUtilsUseCases.Cookies.getLastUser()

    if (session && session.IdUser) {
        return session.IdUser
    }

    return lastUser
}

async function getRegisterOptions(userName: string, rpID: string) {
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

async function getAuthOptions(IdUser: number, rpID: string) {
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