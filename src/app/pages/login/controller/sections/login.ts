import { dialogs } from "@/app/pages/components/Dialogs/dialogs";
import { UtilTypes } from "@/database/UtilTypes";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";
import axios from "axios";
import md5 from "md5";
import { Dispatch, SetStateAction } from "react";

export class Login {
    public async run(loginData: UtilTypes.LoginData, setLoading: Dispatch<SetStateAction<boolean>>) {
        setLoading(true)

        let success = await this.login(loginData)

        setLoading(false)

        if (success === null) {
            return
        }

        if (success) {
            location.href = "/pages/inicio"
        } else {
            dialogs.Info.show("Usuário ou senha não encontrados!")
        }
    }

    private async login(loginData: UtilTypes.LoginData) {
        try {
            let { data } = await axios.post<{ success: boolean }>("/api/users/login", {
                username: loginData.username,
                password: md5(loginData.password),
                remember: loginData.remember
            })

            return data.success
        } catch (error) {
            clientUtilsUseCases.handleError(error, "Ocorreu um erro ao fazer login!")
            return null
        }
    }
}