import { ignoreAuthUseCases } from "@/useCases/IgnoreAuth/IgnoreAuthUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'

export class SetUseAuth {
    public async run(request: NextRequest) {

        let { searchParams } = new URL(request.url)

        let DeviceKey = (searchParams.get('DeviceKey') || crypto.randomBytes(40).toString("base64")) as string

        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        await ignoreAuthUseCases.create({
            DeviceKey: DeviceKey,
            IdUser: session.IdUser,
        })

        return NextResponse.json({ success: true, DeviceKey: DeviceKey })
    }
}