import { UtilsUseCases } from "@/useCases/Utils/UtilsUseCases";
import ResumeItem from "../ResumeItem/ResumeItem";
import { BaseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import styles from './ResumeContainer.module.css'
import { CashInflowsUseCases } from "@/useCases/CashInflows/CashInflowsUseCases";

interface ResumeContainerProps {
    month: number
    year: number
}

export default async function ResumeContainer(props: ResumeContainerProps) {
    let { monthlyExpenseSum, monthlyInflow } = await UtilsUseCases.resolvePromiseObj({
        monthlyExpenseSum: BaseExpensesUseCases.getMonthlySum(props.month, props.year),
        monthlyInflow: CashInflowsUseCases.getAllByMY(props.month, props.year)
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