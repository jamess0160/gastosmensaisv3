import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases"
import { NextResponse } from "next/server"

export class Remove {
    public async run(searchParams: URLSearchParams) {

        let IdDestiny = searchParams.get('IdDestiny')

        if (!IdDestiny) {
            return NextResponse.json({ msg: "IdDestiny não encontrado na query!" }, { status: 406 })
        }

        await destinysUseCases.remove(Number(IdDestiny))

        return NextResponse.json({ msg: "Sucesso" })
    }
}