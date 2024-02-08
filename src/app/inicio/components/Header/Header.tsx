import { IconButton } from "@mui/material";
import DataAtual from "./dataAtual";
import { Settings } from '@mui/icons-material'
import styles from './Header.module.css'
import Link from "next/link";

export default function Header() {
    return (
        <div className={styles.header}>
            <Link href={"/config"}>
                <IconButton color="primary" size="large">
                    <Settings fontSize="large" />
                </IconButton>
            </Link>
            <DataAtual />
        </div>
    )
}