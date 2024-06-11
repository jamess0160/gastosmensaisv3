import { BankResume } from "@/useCases/BaseExpenses/getMonthlyBanksResume";
import ResumeItem from "../ResumeItem/ResumeItem";
import styles from './BankResume.module.css'

interface BankProps {
    bank: BankResume
}

const defaultImage = "/bankIcons/padrao.svg"

export default function BankResume({ bank }: BankProps) {
    return (
        <div className={styles.bankContainer}>
            <div className={styles.bankName}>
                <img src={bank.BankData.IconPath || defaultImage} style={{ width: "50px" }} />
                <div>{bank.BankData.Name}</div>
            </div>
            <div className={styles.bank}>
                
                {bank.Categories.map((item, index) => {
                    let category = item.IdExpenseCategory !== 1 ? `#Category${item.IdExpenseCategory}` : ""

                    return <ResumeItem Name={item.CategoryName} Value={item.ExpensesSum} href={`/categorias/banco/${bank.BankData.IdBank}${category}`} key={index} />
                })}

                <ResumeItem Name="Total de gastos" Value={bank.TotalExpensesSum} href="" />
            </div>
        </div>
    )
}