import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { usersAuthUseCases } from "@/useCases/UsersAuth/UsersAuthUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    let { searchParams } = new URL(request.url)
    let DeviceKey = searchParams.get('DeviceKey') as string
    let IdUser = await getUserId()

    if (!IdUser) {
        return NextResponse.json({})
    }

    let userData = await usersUseCases.getById(IdUser)

    if (!userData) {
        throw new Error("Usuário não encontrado!")
    }

    if (userData.UseAuth !== true) {
        return NextResponse.json({ UseAuth: userData?.UseAuth })
    }

    let userAuths = await usersAuthUseCases.getByUser(IdUser)

    return NextResponse.json({
        UseAuth: userAuths.some((item) => item.DeviceKey === DeviceKey) || null
    })
}

async function getUserId() {
    let session = await serverUtilsUseCases.Cookies.getSession()
    let lastUser = await serverUtilsUseCases.Cookies.getLastUser()

    if (session && session.IdUser) {
        return session.IdUser
    }

    return lastUser
}

export async function POST() {
    let session = await serverUtilsUseCases.Cookies.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    await usersUseCases.update(session.IdUser, { UseAuth: false })

    return NextResponse.json({ success: true })
}