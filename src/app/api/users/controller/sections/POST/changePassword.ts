import { UtilTypes } from "@/database/UtilTypes";
import { usersUseCases } from "@/useCases/Users/UsersUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import md5 from "md5";
import { NextRequest, NextResponse } from "next/server";

export class ChangePassword {
    public async run(request: NextRequest) {

        let data = await request.json() as UtilTypes.UserChangePassword

        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let userData = await usersUseCases.getById(session.IdUser)

        if (!userData) {
            throw new Error(`Usuário #${session.IdUser} não encontrado!`)
        }

        if (userData.Password !== md5(data.current)) {
            return serverUtilsUseCases.SendClientMessage.run("error", { msg: "A senha atual está incorreta!" })
        }

        if (data.new !== data.confirmNew) {
            return serverUtilsUseCases.SendClientMessage.run("error", { msg: "As senhas não conferem!" })
        }

        await usersUseCases.update(session.IdUser, { Password: md5(data.new) })

        return NextResponse.json({ msg: "Sucesso!" })
    }
}