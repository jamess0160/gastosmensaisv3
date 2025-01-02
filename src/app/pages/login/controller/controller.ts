import { UtilTypes } from "@/database/UtilTypes";
import { Login } from "./sections/login";
import { Dispatch, SetStateAction } from "react";
import { HandleWebAuth } from "../../components/WebAuth/sections/handleWebAuth/handleWebAuth";

export class LoginController {

    private readonly Login = new Login()
    private readonly HandleWebAuth = new HandleWebAuth()

    private initDebouncer!: NodeJS.Timeout

    public init() {
        clearTimeout(this.initDebouncer)
        this.initDebouncer = setTimeout(() => {
            this.HandleWebAuth.run({ login: true })
        }, 300);
    }

    public async login(loginData: UtilTypes.LoginData, setLoading: Dispatch<SetStateAction<boolean>>) {
        return this.Login.run(loginData, setLoading)
    }
}