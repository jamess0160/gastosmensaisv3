import { banksController } from "./controller/controller";

export const POST = banksController.Create.run

export const PUT = banksController.Update.run

export const DELETE = banksController.Remove.run