import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let data = await request.json()

    console.log(JSON.stringify(data, null, 2))

    return NextResponse.json({})
}