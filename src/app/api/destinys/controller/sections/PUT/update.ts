import { CreateTypes } from "@/database/CreateTypes";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export class Update {
    public async run(request: NextRequest) {
        let body = await request.json() as CreateTypes.CreateDestiny

        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        if (!body.IdDestiny) {
            return NextResponse.json({ msg: "body.IdDestiny não encontrado!" }, { status: 500 })
        }

        await destinysUseCases.update(body.IdDestiny, {
            Name: body.Name,
            Color: body.Color,
            IdUser: Number(IdUser),
            Position: Number(body.Position),
        })

        return NextResponse.json({ msg: "Sucesso" })
    }
}