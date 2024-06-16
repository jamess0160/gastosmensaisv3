import { IconButton } from "@mui/material";
import { Assessment, Settings } from '@mui/icons-material'
import styles from './Header.module.css'
import Link from "next/link";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";

interface HeaderProps {
    month: number
    year: number
}

export default function Header({ month, year }: HeaderProps) {
    return (
        <div className={styles.header}>
            <div>
                <Link href={"/pages/config"}>
                    <IconButton color="primary" size="large">
                        <Settings fontSize="large" />
                    </IconButton>
                </Link>
                <Link href={"/pages/relatorios"}>
                    <IconButton color="primary" size="large">
                        <Assessment fontSize="large" />
                    </IconButton>
                </Link>
            </div>
            <div className="m-0 text-4xl">
                {`${clientUtilsUseCases.months[month]}, ${year}`}
            </div>
        </div>
    )
}