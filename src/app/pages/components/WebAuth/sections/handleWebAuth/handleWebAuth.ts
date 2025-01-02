import axios from "axios"
import { RegisterUser } from "./sections/registerUser"
import { AuthenticateUser } from "./sections/authenticateUser"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"

export class HandleWebAuth {

    private readonly AuthenticateUser = new AuthenticateUser()
    private readonly RegisterUser = new RegisterUser()

    public async run(options: AuthOptions) {

        if (clientUtilsUseCases.isMobile() === false) {
            return
        }
        
        let result = await this.userUseAuth()

        if (result.UseAuth === true && this.checkOptions("login", options)) {
            return this.AuthenticateUser.run()
        }

        if (result.UseAuth === null && this.checkOptions("postLogin", options)) {
            return this.RegisterUser.run()
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