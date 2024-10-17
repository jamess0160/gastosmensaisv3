import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { users } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let data = await request.json() as LoginData

    let user = await usersUseCases.login(data.login, data.password)

    if (!user) {
        return NextResponse.json({ error: true })
    }

    return NextResponse.json({ error: false, user })
}

interface LoginData {
    login: string
    password: string
}

export type LoginResult = { error: true } | { error: false, user: users }