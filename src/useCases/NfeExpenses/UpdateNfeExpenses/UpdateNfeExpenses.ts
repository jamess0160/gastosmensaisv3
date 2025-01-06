import { BaseSection } from "@/base/baseSection";
import { CreateTypes } from "@/database/CreateTypes";
import { NfeExpensesUseCases } from "../NfeExpensesUseCases";
import { ExtractNfeData } from "../ExtractNfeData/ExtractNfeData";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { baseexpenses } from "@prisma/client";
import { BaseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";

export class UpdateNfeExpenses extends BaseSection<NfeExpensesUseCases> {

    private readonly ExtractNfeData = new ExtractNfeData()

    public async run(BaseExpense: baseexpenses, createExpenseData: CreateTypes.CreateExpense) {

        if (!createExpenseData.DanfeCode) {
            throw new Error("DanfeCode não encontrado")
        }

        let danfeData = await this.ExtractNfeData.run(createExpenseData.DanfeCode)

        if (!danfeData.Valid) {
            return serverUtilsUseCases.SendClientMessage.run("error", { msg: danfeData.Message })
        }

        await new BaseExpensesUseCases(this.instance.prisma).deleteChilds(BaseExpense.IdBaseExpense)

        if (!BaseExpense.IdUser) throw new Error("IdUser não encontrado")

        return this.instance.CreateNfeExpenses.run(BaseExpense.IdUser, createExpenseData)
    }
}