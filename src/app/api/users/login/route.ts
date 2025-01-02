import { UtilTypes } from "@/database/UtilTypes";
import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        cookies().delete("lastUser")
        let loginData = await request.json() as UtilTypes.LoginData

        if (!loginData.username || !loginData.password) {
            return NextResponse.json({ msg: "campos 'username' ou 'password' não enviado" }, { status: 406 })
        }

        let user = await usersUseCases.login(loginData.username, loginData.password)

        if (!user) {
            return NextResponse.json({ success: false })
        }

        await serverUtilsUseCases.setSession({
            IdUser: user.IdUser,
            UserName: user.Name || "",
            UserAuth: user.UseAuth
        })

        if (loginData.remember === true) {
            cookies().set("lastUser", await serverUtilsUseCases.CriptManager.cript({ IdUser: user.IdUser }))
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ msg: "Ocorreu um erro ao fazer o login" }, { status: 500 })
    }
}