import { GenerateReports } from "./sections/POST/generateReports";

class RelatoriosController {
    public readonly GenerateReports = new GenerateReports()
}

export const relatoriosController = new RelatoriosController()