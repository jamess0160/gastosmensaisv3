import { Remove } from "./sections/DELETE/remove";
import { Clone } from "./sections/POST/clone";
import { Create } from "./sections/POST/create";
import { Update } from "./sections/PUT/update";

class CashInFlowController {
    public readonly Create = new Create()
    public readonly Update = new Update()
    public readonly Remove = new Remove()
    public readonly Clone = new Clone()
}

export const cashInFlowController = new CashInFlowController()