import { BankResume } from "@/useCases/BaseExpenses/getMonthlyBanksResume";
import ResumeItem from "../ResumeItem/ResumeItem";
import styles from './BankResume.module.css'
import Image from "next/image";

interface BankProps {
    bank: BankResume
}

const defaultImage = "/bankIcons/padrao.svg"

export default function BankResume({ bank }: BankProps) {
    return (
        <div className={styles.bankContainer}>
            <div className={styles.bankName}>
                <Image alt="sem imagem" src={bank.BankData.IconPath || defaultImage} width={50} height={50} />
                <div>{bank.BankData.Name}</div>
            </div>
            <div className={styles.bank}>

                {bank.Categories.map((item, index) => {
                    let category = item.IdExpenseCategory !== 1 ? `#Category${item.IdExpenseCategory}` : ""

                    return <ResumeItem Name={item.CategoryName} Value={item.ExpensesSum} href={`/categorias/banco/${bank.BankData.IdBank}${category}`} key={index} />
                })}

                <ResumeItem Name="Total de gastos" Value={bank.TotalExpensesSum} href={`/categorias/banco/${bank.BankData.IdBank}`} />
            </div>
        </div>
    )
}