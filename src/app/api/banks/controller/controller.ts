import { Remove } from "./sections/DELETE/remove";
import { Create } from "./sections/POST/create";
import { Update } from "./sections/PUT/update";

class BanksController {
    public readonly Create = new Create()
    public readonly Update = new Update()
    public readonly Remove = new Remove()
}

export const banksController = new BanksController()