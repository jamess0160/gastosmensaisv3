import { loginController } from "../controller/controller";

export const POST = loginController.Login.run.bind(loginController.Login)