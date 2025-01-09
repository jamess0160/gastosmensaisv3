import { nfeItemCategoriesUseCases } from "@/useCases/NfeItemCategories/NfeItemCategoriesUseCases"
import { NextRequest, NextResponse } from "next/server"

export class Remove {
    public async run(request: NextRequest) {

        let { searchParams } = new URL(request.url)
        let IdNfeItemCategory = searchParams.get('IdNfeItemCategory')

        if (!IdNfeItemCategory) {
            return NextResponse.json({ msg: "IdNfeItemCategory não encontrado na query!" }, { status: 406 })
        }

        await nfeItemCategoriesUseCases.remove(Number(IdNfeItemCategory))

        return NextResponse.json({ msg: "Sucesso" })
    }
}