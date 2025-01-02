import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    let IdUser = await getUserId()

    if (!IdUser) {
        return NextResponse.json({})
    }

    let userData = await usersUseCases.getById(IdUser)

    if (!userData) {
        throw new Error("Usuário não encontrado!")
    }

    return NextResponse.json({ UseAuth: userData?.UseAuth })
}

async function getUserId() {
    let session = await serverUtilsUseCases.getSession()
    let lastUser = cookies().get("lastUser")

    if (session && session.IdUser) {
        return session.IdUser
    }

    if (!lastUser) {
        return null
    }

    let data = await serverUtilsUseCases.CriptManager.decript(lastUser.value) as { IdUser: number }

    return data.IdUser
}

export async function POST() {
    let session = await serverUtilsUseCases.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    await usersUseCases.update(session.IdUser, { UseAuth: false })

    return NextResponse.json({ success: true })
}