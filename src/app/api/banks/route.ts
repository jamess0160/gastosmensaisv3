import { CreateTypes } from "@/database/CreateTypes";
import { banksUseCases } from "@/useCases/Banks/BanksUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    let body = await request.json() as CreateTypes.CreateBank
    let session = await serverUtilsUseCases.Cookies.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    let { IdUser } = session

    await banksUseCases.create({
        Name: body.Name,
        Color: body.Color,
        IdUser: Number(IdUser),
    })

    return NextResponse.json({ msg: "Sucesso" })
}

export async function PUT(request: NextRequest) {

    let body = await request.json() as CreateTypes.CreateBank
    let session = await serverUtilsUseCases.Cookies.getSession()

    if (!session) {
        return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
    }

    let { IdUser } = session

    if (!body.IdBank) {
        return NextResponse.json({ msg: "body.IdBank não encontrado!" }, { status: 500 })
    }

    await banksUseCases.update(body.IdBank, {
        Name: body.Name,
        Color: body.Color,
        IdUser: Number(IdUser),
    })

    return NextResponse.json({ msg: "Sucesso" })
}

export async function DELETE(request: NextRequest) {

    let { searchParams } = new URL(request.url)
    let IdBank = searchParams.get('IdBank')

    if (!IdBank) {
        return NextResponse.json({ msg: "IdBank não encontrado na query!" }, { status: 406 })
    }

    await banksUseCases.remove(Number(IdBank))

    return NextResponse.json({ msg: "Sucesso" })
}