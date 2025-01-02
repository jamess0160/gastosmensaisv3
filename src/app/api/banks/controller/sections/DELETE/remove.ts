import { banksUseCases } from "@/useCases/Banks/BanksUseCases"
import { NextResponse } from "next/server"

export class Remove {
    public async run(searchParams: URLSearchParams) {

        let IdBank = searchParams.get('IdBank')

        if (!IdBank) {
            return NextResponse.json({ msg: "IdBank não encontrado na query!" }, { status: 406 })
        }

        await banksUseCases.remove(Number(IdBank))

        return NextResponse.json({ msg: "Sucesso" })
    }
}