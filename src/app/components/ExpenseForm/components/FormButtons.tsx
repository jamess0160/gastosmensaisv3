import { Button } from "@mui/material"
import { Dispatch } from "react"
import styles from '../ExpenseForm.module.css'

//#region Functions 

export default function FormButtons({ setFormState, edit }: FormButtonProps) {
    return (
        <div className={styles.botoes}>
            <Button onClick={() => setFormState(false)} className={`${styles.botao} ${styles.cancelar}`} >Fechar</Button>
            <Button type="submit" className={`${styles.botao} ${styles.cadastrar}`} >{edit ? "Editar" : "Cadastrar"}</Button>
        </div>
    )
}

//#endregion

//#region Interfaces / Types 

interface FormButtonProps {
    setFormState: Dispatch<boolean>
    edit: boolean
}

//#endregion