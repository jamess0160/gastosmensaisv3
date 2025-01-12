import { CreateTypes } from "@/database/CreateTypes";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export class Update {
    public async run(request: NextRequest) {

        let body = await request.json() as CreateTypes.CreateExpenseCategory
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        if (!body.IdExpenseCategory) {
            return NextResponse.json({ msg: "body.IdExpenseCategory não encontrado!" }, { status: 500 })
        }

        await expenseCategoriesUseCases.update(body.IdExpenseCategory, {
            Description: body.Description,
            IdUser: Number(IdUser),
            Position: Number(body.Position),
            Color: body.Color,
        })

        return NextResponse.json({ msg: "Sucesso" })
    }
}