import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { usersAuthUseCases } from "@/useCases/UsersAuth/UsersAuthUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export class CheckUser {

    public async run(request: NextRequest) {
        let { searchParams } = new URL(request.url)
        let DeviceKey = searchParams.get('DeviceKey') as string
        let IdUser = await this.getUserId()

        if (!IdUser) {
            return NextResponse.json({})
        }

        let userData = await this.getUserData(IdUser)

        if (userData.UseAuth !== true) {
            return NextResponse.json({ UseAuth: userData?.UseAuth })
        }

        let userAuths = await usersAuthUseCases.getByUser(IdUser)

        return NextResponse.json({
            UseAuth: userAuths.some((item) => item.DeviceKey === DeviceKey) || null
        })
    }

    private async getUserId() {
        let session = await serverUtilsUseCases.Cookies.getSession()
        let lastUser = await serverUtilsUseCases.Cookies.getLastUser()

        if (session && session.IdUser) {
            return session.IdUser
        }

        return lastUser
    }

    private async getUserData(IdUser: number) {
        let userData = await usersUseCases.getById(IdUser)

        if (!userData) {
            throw new Error("Usuário não encontrado!")
        }

        return userData
    }
}