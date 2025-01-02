import { banksUseCases } from "@/useCases/Banks/BanksUseCases"
import { NextResponse } from "next/server"

export class Remove {
    public async run(IdBank: number) {
        await banksUseCases.remove(IdBank)

        return NextResponse.json({ msg: "Sucesso" })
    }
}