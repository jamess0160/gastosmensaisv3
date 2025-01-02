import { CreateTypes } from "@/database/CreateTypes";
import { NextRequest, NextResponse } from "next/server";
import { banksController } from "./controller/controller";

export async function POST(request: NextRequest) {
    let body = await request.json() as CreateTypes.CreateBank

    return banksController.Create.run(body)
}

export async function PUT(request: NextRequest) {
    let body = await request.json() as CreateTypes.CreateBank

    return banksController.Update.run(body)
}

export async function DELETE(request: NextRequest) {
    let { searchParams } = new URL(request.url)
    let IdBank = searchParams.get('IdBank')

    if (!IdBank) {
        return NextResponse.json({ msg: "IdBank não encontrado na query!" }, { status: 406 })
    }

    return banksController.Remove.run(Number(IdBank))
}