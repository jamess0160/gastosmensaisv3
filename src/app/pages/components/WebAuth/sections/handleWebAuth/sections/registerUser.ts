import { dialogs } from "@/app/pages/components/Dialogs/dialogs"
import { UtilTypes } from "@/database/UtilTypes"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { PublicKeyCredentialCreationOptionsJSON, RegistrationResponseJSON, startRegistration } from "@simplewebauthn/browser"
import axios from "axios"

export class RegisterUser {
    public async run() {
        try {
            let options = await this.getOptions("register")

            let authResult = await startRegistration({ optionsJSON: options })

            let response = await this.createAuth(authResult)

            if (response.verified) {
                dialogs.Info.show("Biometria registrada com sucesso!")
                clientUtilsUseCases.LocalStorage.setDeviceKey(response.DeviceKey)
            } else {
                clientUtilsUseCases.HandleError.run({}, "Ocorreu um erro ao cadastrar a biometria")
            }

        } catch (error) {
            clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro ao cadastrar a biometria")
        }
    }

    private async getOptions(type: UtilTypes.WebAuthOptionTypes) {
        let { data } = await axios.get<PublicKeyCredentialCreationOptionsJSON>("/api/webAuth/options", {
            params: { type }
        })
        return data
    }

    private async createAuth(authResult: RegistrationResponseJSON) {

        let DeviceKey = clientUtilsUseCases.LocalStorage.getDeviceKey()

        let { data } = await axios.post<CreateAuthResponse>("/api/webAuth/register", authResult, {
            params: { DeviceKey }
        })
        return data
    }
}

type CreateAuthResponse = { verified: false } | { verified: true, DeviceKey: string }