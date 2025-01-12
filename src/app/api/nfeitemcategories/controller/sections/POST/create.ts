import { CreateTypes } from "@/database/CreateTypes";
import { nfeItemCategoriesUseCases } from "@/useCases/NfeItemCategories/NfeItemCategoriesUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export class Create {
    public async run(request: NextRequest) {

        let body = await request.json() as CreateTypes.CreateNfeItemCategory
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        await nfeItemCategoriesUseCases.create({
            Description: body.Description,
            IdUser: Number(IdUser),
            Color: body.Color,
        })

        return NextResponse.json({ msg: "Sucesso" })
    }
}