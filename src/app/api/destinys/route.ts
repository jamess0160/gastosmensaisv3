import { CreateTypes } from "@/database/CreateTypes";
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    let body = await request.json() as CreateTypes.CreateDestiny
    let IdUser = request.headers.get("IdUser")

    await destinysUseCases.create({
        Name: body.Name,
        Color: body.Color,
        IdUser: Number(IdUser),
    })

    return NextResponse.json({ msg: "Sucesso" })
}

export async function PUT(request: NextRequest) {

    let body = await request.json() as CreateTypes.CreateDestiny
    let IdUser = request.headers.get("IdUser")

    if (!body.IdDestiny) {
        return NextResponse.json({ msg: "body.IdDestiny não encontrado!" }, { status: 500 })
    }

    await destinysUseCases.update(body.IdDestiny, {
        Name: body.Name,
        Color: body.Color,
        IdUser: Number(IdUser),
    })

    return NextResponse.json({ msg: "Sucesso" })
}

export async function DELETE(request: NextRequest) {

    let { searchParams } = new URL(request.url)
    let IdDestiny = searchParams.get('IdDestiny')

    if (!IdDestiny) {
        return NextResponse.json({ msg: "IdDestiny não encontrado na query!" }, { status: 406 })
    }

    await destinysUseCases.remove(Number(IdDestiny))

    return NextResponse.json({ msg: "Sucesso" })
}