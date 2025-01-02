import { expenseCategoriesController } from "./controller/controller";

export const POST = expenseCategoriesController.Create.run

export const PUT = expenseCategoriesController.Update.run

export const DELETE = expenseCategoriesController.Remove.run