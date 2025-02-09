import { ignoreAuthUseCases } from "@/useCases/IgnoreAuth/IgnoreAuthUseCases";
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

        let userAuths = await usersAuthUseCases.getByUser(IdUser)
        let ignoreAuths = await ignoreAuthUseCases.getByUser(IdUser)

        let useAuth = userAuths.some((item) => item.DeviceKey === DeviceKey)

        let ignoreAuth = ignoreAuths.some((item) => item.DeviceKey === DeviceKey)

        if (useAuth && !ignoreAuth) {
            return NextResponse.json({
                UseAuth: true
            })
        }

        if (!useAuth && ignoreAuth) {
            return NextResponse.json({
                UseAuth: false
            })
        }

        if (!useAuth && !ignoreAuth) {
            return NextResponse.json({
                UseAuth: null
            })
        }

        throw new Error("useAuth e ignoreAuth encontrados para o mesmo dispositivo!")
    }

    private async getUserId() {
        let session = await serverUtilsUseCases.Cookies.getSession()
        let lastUser = await serverUtilsUseCases.Cookies.getLastUser()

        if (session && session.IdUser) {
            return session.IdUser
        }

        return lastUser
    }
}