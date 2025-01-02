import { expensesUseCase } from "@/useCases/Expenses/ExpensesUseCase"
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases"
import { NextRequest, NextResponse } from "next/server"

export class Create {
    public async run(request: NextRequest) {
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let { IdUser } = session

        return NextResponse.json(await expensesUseCase.CreateExpense.run(Number(IdUser), await request.json()))
    }
}