import { Remove } from "./sections/DELETE/remove";
import { Create } from "./sections/POST/create";
import { Update } from "./sections/PUT/update";

class DestinysController {
    public readonly Create = new Create()
    public readonly Update = new Update()
    public readonly Remove = new Remove()
}

export const destinysController = new DestinysController()