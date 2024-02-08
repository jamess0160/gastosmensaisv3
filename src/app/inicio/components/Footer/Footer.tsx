import { Button, IconButton } from "@mui/material";
import { Add } from '@mui/icons-material'
import styles from './Footer.module.css'

export default function Footer() {
    return (
        <div className={styles.Footer}>
            <IconButton className={styles.Button} color="primary" >
                <Add fontSize="large" />
            </IconButton>
        </div>
    )
}