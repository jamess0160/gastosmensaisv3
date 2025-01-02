import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextResponse } from "next/server";

export class SetUseAuth {
    public async run() {
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        await usersUseCases.update(session.IdUser, { UseAuth: false })

        return NextResponse.json({ success: true })
    }
}