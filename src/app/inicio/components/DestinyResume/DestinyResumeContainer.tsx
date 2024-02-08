import { DestinyResume } from "@/useCases/BaseExpenses/getMonthlyDestinyResume";
import ResumeItem from "../ResumeItem/ResumeItem";
import styles from './DestinyResumeContainer.module.css'

interface DestinyResumeContainerParams {
    DestinysResume: DestinyResume[]
}

export default function DestinyResumeContainer({ DestinysResume }: DestinyResumeContainerParams) {
    return (
        <div className={styles.DestinyResumeContainer}>
            {DestinysResume.map((item, index) => {
                return <ResumeItem Name={item.DestinyData.Name} Value={item.RemainingBudget} color={item.DestinyData.Color || undefined} href="" key={index} />
            })}
        </div>
    )
}