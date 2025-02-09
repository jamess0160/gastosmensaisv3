import axios from "axios"
import { RegisterUser } from "./sections/registerUser"
import { AuthenticateUser } from "./sections/authenticateUser"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { dialogs } from "../../../Dialogs/dialogs"
import { NegateAuth } from "./sections/negateAuth"

export class HandleWebAuth {

    private readonly AuthenticateUser = new AuthenticateUser()
    private readonly RegisterUser = new RegisterUser()
    private readonly NegateAuth = new NegateAuth()

    public async run(options: AuthOptions) {

        if (clientUtilsUseCases.isMobile() === false) {
            return
        }

        let result = await this.userUseAuth()

        if (result.UseAuth === true && this.checkOptions("login", options)) {
            return this.AuthenticateUser.run()
        }

        if (result.UseAuth === null && this.checkOptions("postLogin", options)) {
            let result = await dialogs.Confirm.show("Você deseja cadastrar a biometria para futuros acessos?")

            if (result === true) {
                return this.RegisterUser.run()
            }

            return this.NegateAuth.run()
        }
    }

    private async userUseAuth() {
        let { data } = await axios.get<{ UseAuth: boolean }>("/api/webAuth/checkUser", {
            params: {
                DeviceKey: clientUtilsUseCases.LocalStorage.getDeviceKey()
            }
        })
        return data
    }

    private checkOptions(prop: "login" | "postLogin", options: any) {
        return Boolean(options[prop])
    }
}

type AuthOptions = (
    {
        login: boolean
    }
    | {
        postLogin: boolean
    }
)