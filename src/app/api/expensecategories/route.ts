import { expenseCategoriesController } from "./controller/controller";

export const POST = expenseCategoriesController.Create.run.bind(expenseCategoriesController.Create)

export const PUT = expenseCategoriesController.Update.run.bind(expenseCategoriesController.Update)

export const DELETE = expenseCategoriesController.Remove.run.bind(expenseCategoriesController.Remove)