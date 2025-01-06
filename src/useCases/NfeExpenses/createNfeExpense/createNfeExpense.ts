import { BaseSection } from "@/base/baseSection";
import { CreateTypes } from "@/database/CreateTypes";
import { NfeExpensesUseCases } from "../NfeExpensesUseCases";
import { ExtractNfeData } from "../ExtractNfeData/ExtractNfeData";
import { expensesUseCase } from "@/useCases/Expenses/ExpensesUseCase";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";

export class CreateNfeExpenses extends BaseSection<NfeExpensesUseCases> {

    private readonly ExtractNfeData = new ExtractNfeData()

    public async run(IdUser: number, createExpenseData: CreateTypes.CreateExpense) {

        if (!createExpenseData.DanfeCode) {
            throw new Error("DanfeCode não encontrado")
        }

        let danfeData = await this.ExtractNfeData.run(createExpenseData.DanfeCode)

        if (!danfeData.Valid) {
            return serverUtilsUseCases.SendClientMessage.run("error", { msg: danfeData.Message })
        }

        let { IdBaseExpense } = await expensesUseCase.CreateExpense.createBaseExpense(this.instance.prisma, IdUser, {
            ...createExpenseData,
            Price: danfeData.Value.toString()
        })

        return this.instance.create({
            IdBaseExpense,
            Company: danfeData.Company,
            DanfeCode: createExpenseData.DanfeCode,
            ExpenseDate: clientUtilsUseCases.handleClientDate(createExpenseData.ExpenseDate),
            nfeitems: {
                createMany: {
                    data: danfeData.Items.map((item) => {
                        return {
                            Description: item.Description,
                            Quantity: item.Quantity,
                            UN: item.UN,
                            UnityValue: item.UnityValue,
                            TotalValue: item.TotalValue
                        }
                    })
                }
            }
        })
    }
}