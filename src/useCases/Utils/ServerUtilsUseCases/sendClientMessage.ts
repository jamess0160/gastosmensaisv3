import { NextResponse } from "next/server"

export class SendClientMessage {

    public async run<T extends DataTypes>(type: T, options: ClientDataOptions[T]) {

        if (this.isError(type, options)) {
            return NextResponse.json({ type, msg: options.msg }, { status: 406 })
        }

        if (this.isRedirect(type, options)) {
            return NextResponse.json({ type, url: options.url }, { status: 406 })
        }
    }

    private isError(type: DataTypes, options: any): options is ClientDataOptions['error'] {
        return type === "error"
    }

    private isRedirect(type: DataTypes, options: any): options is ClientDataOptions['redirect'] {
        return type === "redirect"
    }
}

type DataTypes = "error" | "redirect"

interface ClientDataOptions {
    error: { msg: string }
    redirect: { url: string }
}