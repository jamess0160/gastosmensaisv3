import { Button } from "@mui/material"
import { Dispatch } from "react"
import styles from '../ExpenseForm.module.css'

//#region Functions 

export default function FormButtons({ setFormState, edit }: FormButtonProps) {
    return (
        <div className={styles.botoes}>
            <Button className="w-1/3 border border-solid" onClick={() => setFormState(false)} >Fechar</Button>
            <Button className="w-1/3" variant="contained" type="submit" >{edit ? "Editar" : "Cadastrar"}</Button>
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