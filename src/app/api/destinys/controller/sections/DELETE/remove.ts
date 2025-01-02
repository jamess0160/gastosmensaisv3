import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases"
import { NextRequest, NextResponse } from "next/server"

export class Remove {
    public async run(request: NextRequest) {
        let { searchParams } = new URL(request.url)

        let IdDestiny = searchParams.get('IdDestiny')

        if (!IdDestiny) {
            return NextResponse.json({ msg: "IdDestiny não encontrado na query!" }, { status: 406 })
        }

        await destinysUseCases.remove(Number(IdDestiny))

        return NextResponse.json({ msg: "Sucesso" })
    }
}