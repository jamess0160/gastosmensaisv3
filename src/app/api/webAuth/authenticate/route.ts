import { webAuthController } from "../controller/controller";

export const POST = webAuthController.Authenticate.run.bind(webAuthController.Authenticate)