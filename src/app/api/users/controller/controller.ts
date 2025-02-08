import { ChangePassword } from "./sections/POST/changePassword";
import { Login } from "./sections/POST/login";

class LoginController {
    public readonly Login = new Login()
    public readonly ChangePassword = new ChangePassword()
}

export const loginController = new LoginController()