import ResumeItem from "../ResumeItem/ResumeItem";
import styles from './ResumeContainer.module.css'
import { CashInflowMY } from "@/useCases/CashInflows/CashInflowsUseCases";

export default function ResumeContainer({ ResumeContainerData }: ResumeContainerProps) {

    let monthlyInflowSum = ResumeContainerData.monthlyInflow.reduce((old, item) => old + item.Value, 0)

    return (
        <div className={styles.ResumeContainer}>
            <ResumeItem Name="Total de gastos" Value={ResumeContainerData.monthlyExpenseSum} />
            <ResumeItem Name="Total entradas" Value={monthlyInflowSum} color="#315663" />
            <ResumeItem Name="Restante" Value={monthlyInflowSum - ResumeContainerData.monthlyExpenseSum} color="#202533" />
        </div>
    )
}

//#region Interfaces / Types 

interface ResumeContainerProps {
    ResumeContainerData: ResumeContainerData
}

export interface ResumeContainerData {
    monthlyExpenseSum: number
    monthlyInflow: CashInflowMY[]
}

//#endregion