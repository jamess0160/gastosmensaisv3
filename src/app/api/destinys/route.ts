import { CreateTypes } from "@/database/CreateTypes";
import { NextRequest } from "next/server";
import { destinysController } from "./controller/controller";

export async function POST(request: NextRequest) {
    let body = await request.json() as CreateTypes.CreateDestiny

    return destinysController.Create.run(body)
}

export async function PUT(request: NextRequest) {
    let body = await request.json() as CreateTypes.CreateDestiny

    return destinysController.Update.run(body)
}

export async function DELETE(request: NextRequest) {
    let { searchParams } = new URL(request.url)

    return destinysController.Remove.run(searchParams)
}