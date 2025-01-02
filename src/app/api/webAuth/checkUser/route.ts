import { webAuthController } from "../controller/controller";

export const GET = webAuthController.CheckUser.run

export const POST = webAuthController.SetUseAuth.run