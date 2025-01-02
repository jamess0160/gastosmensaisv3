import { destinysController } from "./controller/controller";

export const POST = destinysController.Create.run.bind(destinysController.Create)

export const PUT = destinysController.Update.run.bind(destinysController.Update)

export const DELETE = destinysController.Remove.run.bind(destinysController.Remove)