import { Remove } from "./sections/DELETE/remove"
import { Create } from "./sections/POST/create"
import { Update } from "./sections/PUT/update"
import { UpdateActives } from "./sections/PUT/updateActive"

class ExpenseController {
    public readonly Create = new Create()
    public readonly Update = new Update()
    public readonly UpdateActives = new UpdateActives()
    public readonly Remove = new Remove()
}

export const expenseController = new ExpenseController()