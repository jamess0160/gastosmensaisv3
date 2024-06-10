import { IconButton } from "@mui/material";
import { Settings } from '@mui/icons-material'
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
            <Link href={"/config"}>
                <IconButton color="primary" size="large">
                    <Settings fontSize="large" />
                </IconButton>
            </Link>
            <h1 className="m-0">
                {`${clientUtilsUseCases.months[month]}, ${year}`}
            </h1>
        </div>
    )
}