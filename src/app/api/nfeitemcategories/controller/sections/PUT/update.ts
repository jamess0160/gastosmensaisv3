import { CreateTypes } from "@/database/CreateTypes";
import { nfeItemCategoriesUseCases } from "@/useCases/NfeItemCategories/NfeItemCategoriesUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export class Update {
    public async run(request: NextRequest) {

        let body = await request.json() as CreateTypes.CreateNfeItemCategory
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        if (!body.IdNfeItemCategory) {
            return NextResponse.json({ msg: "body.IdNfeItemCategory não encontrado!" }, { status: 500 })
        }

        await nfeItemCategoriesUseCases.update(body.IdNfeItemCategory, {
            Description: body.Description,
            IdUser: Number(IdUser),
        })

        return NextResponse.json({ msg: "Sucesso" })
    }
}