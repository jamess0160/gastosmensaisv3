import { Login } from "./sections/POST/login";

class LoginController {
    public readonly Login = new Login()
}

export const loginController = new LoginController()