import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";
import ResumeItem from "../ResumeItem/ResumeItem";
import styles from './ResumeContainer.module.css'
import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { cashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";

export default async function ResumeContainer(props: ResumeContainerProps) {

    let { monthlyExpenseSum, monthlyInflow } = await clientUtilsUseCases.resolvePromiseObj({
        monthlyExpenseSum: baseExpensesUseCases.GetMonthlySum.run(props.month, props.year),
        monthlyInflow: cashInflowsUseCases.getAllByMY(props.month, props.year)
    })

    let monthlyInflowSum = monthlyInflow.reduce((old, item) => old + item.Value, 0)

    return (
        <div className={styles.ResumeContainer}>
            <ResumeItem Name="Total de gastos" Value={monthlyExpenseSum} />
            <ResumeItem Name="Total entradas" Value={monthlyInflowSum} color="#315663" />
            <ResumeItem Name="Restante" Value={monthlyInflowSum - monthlyExpenseSum} color="#202533" />
        </div>
    )
}

//#region Interfaces / Types 

interface ResumeContainerProps {
    month: number
    year: number
}

//#endregion