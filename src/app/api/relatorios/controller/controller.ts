import { GenerateExpenseReports } from "./sections/POST/generateExpenseReports";
import { GenerateNfeReports } from "./sections/POST/generateNfeReports";

class RelatoriosController {
    public readonly GenerateExpenseReports = new GenerateExpenseReports()
    public readonly GenerateNfeReports = new GenerateNfeReports()
}

export const relatoriosController = new RelatoriosController()