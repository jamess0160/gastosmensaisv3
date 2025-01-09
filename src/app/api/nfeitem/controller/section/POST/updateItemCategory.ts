import { nfeItemsUseCases } from "@/useCases/NfeItems/NfeItemsUseCases";
import { NextRequest, NextResponse } from "next/server";

export class UpdateItemCategory {
    public async run(request: NextRequest) {
        let body = await request.json() as UpdateItemCategoryPayload

        return NextResponse.json(await nfeItemsUseCases.update(body.IdNfeItem, {
            IdNfeItemCategory: body.IdNfeItemCategory
        }))
    }
}

interface UpdateItemCategoryPayload {
    IdNfeItem: number
    IdNfeItemCategory: number
}