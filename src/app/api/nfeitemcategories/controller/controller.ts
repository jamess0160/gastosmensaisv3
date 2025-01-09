import { GetAll } from "./sections/GET/getAll";
import { Remove } from "./sections/DELETE/remove";
import { Create } from "./sections/POST/create";
import { Update } from "./sections/PUT/update";

class Controller {
    public readonly GetAll = new GetAll()
    public readonly Create = new Create()
    public readonly Update = new Update()
    public readonly Remove = new Remove()
}

export const nfeItemCategoriesController = new Controller()