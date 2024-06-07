import { BaseUseCase } from "@/base";

export class DestinysUseCases extends BaseUseCase {
    getAll() {
        return this.prisma.destinys.findMany()
    }

}

export const destinysUseCases = new DestinysUseCases()