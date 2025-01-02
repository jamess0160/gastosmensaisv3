import { CreateTypes } from "@/database/CreateTypes";
import { banksUseCases } from "@/useCases/Banks/BanksUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextResponse } from "next/server";

export class Update {
    public async run(body: CreateTypes.CreateBank) {
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        if (!body.IdBank) {
            return NextResponse.json({ msg: "body.IdBank não encontrado!" }, { status: 500 })
        }

        await banksUseCases.update(body.IdBank, {
            Name: body.Name,
            Color: body.Color,
            IdUser: Number(IdUser),
        })

        return NextResponse.json({ msg: "Sucesso" })
    }
}