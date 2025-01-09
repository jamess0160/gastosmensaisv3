import { nfeItemCategoriesUseCases } from "@/useCases/NfeItemCategories/NfeItemCategoriesUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextResponse } from "next/server";

export class GetAll {
    public async run() {

        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        return NextResponse.json(await nfeItemCategoriesUseCases.getAllByUser(session.IdUser))
    }
}