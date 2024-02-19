import { IconButton } from "@mui/material";
import { Settings } from '@mui/icons-material'
import styles from './Header.module.css'
import Link from "next/link";

const monthsArray = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

interface HeaderProps {
    month: number
    year: number
}

export default function Header({ month, year }: HeaderProps) {
    return (
        <div className={styles.header}>
            <Link href={"/config"}>
                <IconButton color="primary" size="large">
                    <Settings fontSize="large" />
                </IconButton>
            </Link>
            <div style={{ fontSize: "2rem" }}>
                {`${monthsArray[month]}, ${year}`}
            </div>
        </div>
    )
}