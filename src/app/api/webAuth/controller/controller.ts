import { CheckUser } from "./sections/GET/checkUser"
import { GetOptions } from "./sections/GET/getOptions"
import { Authenticate } from "./sections/POST/authenticate"
import { Register } from "./sections/POST/register"
import { SetUseAuth } from "./sections/POST/setUseAuth"

class WebAuthController {
    public readonly CheckUser = new CheckUser()
    public readonly GetOptions = new GetOptions()
    public readonly Register = new Register()
    public readonly Authenticate = new Authenticate()
    public readonly SetUseAuth = new SetUseAuth()
}

export const webAuthController = new WebAuthController()