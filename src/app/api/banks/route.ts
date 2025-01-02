import { banksController } from "./controller/controller";

export const POST = banksController.Create.run.bind(banksController.Create)

export const PUT = banksController.Update.run.bind(banksController.Update)

export const DELETE = banksController.Remove.run.bind(banksController.Remove)