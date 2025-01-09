import { nfeItemCategoriesController } from "./controller/controller";

export const GET = nfeItemCategoriesController.GetAll.run.bind(nfeItemCategoriesController.GetAll)

export const POST = nfeItemCategoriesController.Create.run.bind(nfeItemCategoriesController.Create)

export const PUT = nfeItemCategoriesController.Update.run.bind(nfeItemCategoriesController.Update)

export const DELETE = nfeItemCategoriesController.Remove.run.bind(nfeItemCategoriesController.Remove)