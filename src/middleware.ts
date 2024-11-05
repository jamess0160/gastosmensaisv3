import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { LoginResult } from "./app/api/login/route";
import md5 from 'md5'

const skip = [
    "/api/login",
    "/pages/logOut"
]

export async function middleware(request: NextRequest) {

    if (skip.includes(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    let auth = request.headers.get("authorization");

    if (!auth) {
        return NextResponse.json("Authentication required", {
            headers: {
                "WWW-Authenticate": 'Basic realm="Protected'
            },
            status: 401
        })
    }

    // // Decodifica as credenciais Base64
    let credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
    let [login, password] = credentials.split(':');

    if (login === "logOut") {
        return NextResponse.json("", {
            status: 401
        })
    }

    let { data } = await axios.post<LoginResult>(`${request.nextUrl.origin}/api/login`, { login, password: md5(password) })

    if (data.error) {
        return NextResponse.json("Invalid credentials", {
            headers: {
                "WWW-Authenticate": 'Basic realm="Protected'
            },
            status: 401
        })
    }

    return NextResponse.next({
        headers: {
            "IdUser": data.user.IdUser.toString(),
            "UserName": data.user.Name || ""
        }
    })
}

export const config = {
    matcher: [
        "/pages/:path*",
        "/api/:path*"
    ]
} 