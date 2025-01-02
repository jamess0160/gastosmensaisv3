import { UtilTypes } from "@/database/UtilTypes"
import { AuthenticationResponseJSON, PublicKeyCredentialCreationOptionsJSON, startAuthentication } from "@simplewebauthn/browser"
import axios from "axios"

export class AuthenticateUser {
    public async run() {
        try {
            let options = await this.getOptions("login")

            let authResult = await startAuthentication({ optionsJSON: options })

            let response = await this.authenticate(authResult)

            if (response && response.verified) {
                location.href = "/pages/inicio"
            }
        } catch (error) {
            console.log(error)
        }
    }

    private async getOptions(type: UtilTypes.WebAuthOptionTypes): Promise<PublicKeyCredentialCreationOptionsJSON> {
        let { data } = await axios.get("/api/webAuth/options", {
            params: { type }
        })
        return data
    }

    private async authenticate(authResult: AuthenticationResponseJSON) {
        let { data } = await axios.post("/api/webAuth/authenticate", authResult)
        return data
    }
}