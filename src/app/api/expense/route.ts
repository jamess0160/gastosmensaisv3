import { expenseController } from "./controller/controller";

export const POST = expenseController.Create.run

export const PUT = expenseController.Update.run

export const DELETE = expenseController.Remove.run