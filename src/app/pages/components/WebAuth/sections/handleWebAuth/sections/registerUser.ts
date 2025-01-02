import { dialogs } from "@/app/pages/components/Dialogs/dialogs"
import { UtilTypes } from "@/database/UtilTypes"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import { PublicKeyCredentialCreationOptionsJSON, RegistrationResponseJSON, startRegistration } from "@simplewebauthn/browser"
import axios from "axios"

export class RegisterUser {
    public async run() {
        try {
            let result = await dialogs.Confirm.show("Você deseja cadastrar a biometria para futuros acessos?")

            if (result === false) {
                await this.negateAuth()
                return
            }

            let options = await this.getOptions("register")

            let authResult = await startRegistration({ optionsJSON: options })

            let response = await this.createAuth(authResult)

            if (response && response.verified) {
                dialogs.Info.show("Biometria registrada com sucesso!")
            }
        } catch (error) {
            clientUtilsUseCases.handleError(error, "Ocorreu um erro ao cadastrar a biometria")
        }
    }

    private async getOptions(type: UtilTypes.WebAuthOptionTypes): Promise<PublicKeyCredentialCreationOptionsJSON> {
        let { data } = await axios.get("/api/webAuth/options", {
            params: { type }
        })
        return data
    }

    private async createAuth(authResult: RegistrationResponseJSON) {
        let { data } = await axios.post("/api/webAuth/register", authResult)
        return data
    }

    private negateAuth() {
        return axios.post("/api/webAuth/checkUser")
    }
}