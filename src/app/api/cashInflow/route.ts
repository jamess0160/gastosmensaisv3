import { CreateTypes } from "@/database/CreateTypes";
import { NextRequest } from "next/server";
import { cashInFlowController } from "./controller/controller";

export async function POST(request: NextRequest) {
    let data = await request.json() as CreateTypes.CreateCashInflow

    return cashInFlowController.Create.run(data)
}

export async function PUT(request: NextRequest) {
    let data = await request.json() as CreateTypes.CreateCashInflow

    return cashInFlowController.Update.run(data)
}

export async function DELETE(request: NextRequest) {
    let { searchParams } = new URL(request.url)

    return cashInFlowController.Remove.run(searchParams)
}