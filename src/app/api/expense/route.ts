import { expenseController } from "./controller/controller";

export const POST = expenseController.Create.run.bind(expenseController.Create)

export const PUT = expenseController.Update.run.bind(expenseController.Update)

export const DELETE = expenseController.Remove.run.bind(expenseController.Remove)