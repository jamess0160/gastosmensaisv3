import { DestinyResume } from "@/useCases/BaseExpenses/getMonthlyDestinyResume";
import ResumeItem from "../ResumeItem/ResumeItem";
import styles from './DestinyResumeContainer.module.css'

interface DestinyResumeContainerParams {
    DestinysResume: DestinyResume[]
}

export default function DestinyResumeContainer({ DestinysResume }: DestinyResumeContainerParams) {

    if (DestinysResume.length === 0) {
        return (
            <div className="text-center">
                Você ainda não tem destinos cadastrados! Cadastre eles no menu "Personalização"
            </div>
        )
    }

    return (
        <div className={styles.DestinyResumeContainer}>
            {DestinysResume.map((item, index) => {
                return <ResumeItem Name={item.DestinyData.Name} Value={item.RemainingBudget} color={item.DestinyData.Color || undefined} href={`/pages/categorias/pessoal/${item.DestinyData.IdDestiny}`} key={index} />
            })}
        </div>
    )
}