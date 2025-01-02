import { webAuthController } from "../controller/controller";

export const GET = webAuthController.CheckUser.run.bind(webAuthController.CheckUser)

export const POST = webAuthController.SetUseAuth.run.bind(webAuthController.SetUseAuth)