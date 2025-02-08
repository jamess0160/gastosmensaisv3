import { dialogs } from "@/app/pages/components/Dialogs/dialogs";
import { UtilTypes } from "@/database/UtilTypes";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import axios from "axios";
import { Dispatch } from "react";

class ChangePasswordEvents {
    public async submit(data: UtilTypes.UserChangePassword, dispatch: DispatchProps) {
        dispatch.setLoading(true)
        try {

            if (data.new !== data.confirmNew) {
                dialogs.Info.show("A confirmação de senha deve ser igual a nova senha!")
                return
            }

            await axios.post("/api/users/changePassword", data)

            dispatch.setOpen(false)
            dialogs.Info.show("Senha trocada com sucesso!")

        } catch (error) {
            clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro ao realizar a troca de senha!")
        } finally {
            dispatch.setLoading(false)
        }
    }
}

export const changePasswordEvents = new ChangePasswordEvents()

interface DispatchProps {
    setLoading: Dispatch<boolean>
    setOpen: Dispatch<boolean>
}