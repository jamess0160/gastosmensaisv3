import { NextRequest, NextResponse } from "next/server"
import { UtilTypes } from "@/database/UtilTypes";
import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";

export class Login {
    public async run(request: NextRequest) {
        serverUtilsUseCases.Cookies.clearLastUser()

        let loginData = await request.json() as UtilTypes.LoginData

        if (!loginData.username || !loginData.password) {
            return NextResponse.json({ msg: "campos 'username' ou 'password' não enviado" }, { status: 406 })
        }

        let user = await usersUseCases.login(loginData.username, loginData.password)

        if (!user) {
            return NextResponse.json({ success: false })
        }

        await serverUtilsUseCases.Cookies.setSession({
            IdUser: user.IdUser,
            UserName: user.Name || "",
            IsMobile: loginData.isMobile
        })

        if (loginData.isMobile) {
            await serverUtilsUseCases.Cookies.setLastUser(user.IdUser)
        }

        return NextResponse.json({ success: true })
    }
}