import { CreateTypes } from "@/database/CreateTypes";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export class Create {
    public async run(request: NextRequest) {

        let body = await request.json() as CreateTypes.CreateExpenseCategory
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        await expenseCategoriesUseCases.create({
            Description: body.Description,
            IdUser: Number(IdUser),
        })

        return NextResponse.json({ msg: "Sucesso" })
    }
}