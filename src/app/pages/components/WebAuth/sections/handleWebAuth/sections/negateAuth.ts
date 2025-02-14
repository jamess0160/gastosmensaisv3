import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import axios from "axios"

export class NegateAuth {
    public async run() {
        try {
            let DeviceKey = clientUtilsUseCases.LocalStorage.getDeviceKey()

            let { data } = await axios.post<NegateAuthResponse>("/api/webAuth/checkUser", null, {
                params: { DeviceKey }
            })

            if (data.success) {
                clientUtilsUseCases.LocalStorage.setDeviceKey(data.DeviceKey)
            }

        } catch (error) {
            clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro ao cadastrar a biometria")
        }
    }
}

type NegateAuthResponse = { success: true, DeviceKey: string }