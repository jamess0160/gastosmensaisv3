import { BankResume } from "@/useCases/BaseExpenses/getMonthlyBanksResume";
import ResumeItem from "../ResumeItem/ResumeItem";
import styles from './BankResume.module.css'
import Image from "next/image";

interface BankProps {
    bank: BankResume
}

export default function BankResume({ bank }: BankProps) {

    return (
        <div className={styles.bankContainer}>
            {bank.BankData.IconPath ?
                (
                    <div className={styles.bankName}>
                        <Image alt="sem imagem" src={bank.BankData.IconPath} width={50} height={50} />
                        <div>{bank.BankData.Name}</div>
                    </div>
                )
                : (
                    <div className={styles.bankName}>
                        <div style={{ backgroundColor: bank.BankData.Color || "black", width: 50, height: 50, borderRadius: "10px" }}></div>
                        <div>{bank.BankData.Name}</div>
                    </div>
                )
            }
            <div className={styles.bank}>

                <ResumeItem Name="Total de gastos" Value={bank.TotalExpensesSum} href={`/pages/categorias/banco/${bank.BankData.IdBank}#Category0`} />

                {bank.Categories.map((item, index) => {
                    let category = item.IdExpenseCategory !== 1 ? `#Category${item.IdExpenseCategory}` : ""

                    return <ResumeItem Name={item.CategoryName} Value={item.ExpensesSum} href={`/pages/categorias/banco/${bank.BankData.IdBank}${category}`} key={index} />
                })}

            </div>
        </div>
    )
}