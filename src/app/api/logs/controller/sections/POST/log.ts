import { NextRequest, NextResponse } from "next/server"

export class Log {
    public async run(request: NextRequest) {
        let data = await request.json()

        console.log(JSON.stringify(data, null, 2))

        return NextResponse.json({})
    }
}