import { nfeItemCategoriesController } from "./controller/controller";

export const GET = nfeItemCategoriesController.GetAll.run.bind(nfeItemCategoriesController.GetAll)