import Link from "next/link"
import React from "react"

export default function page() {
    return (
        <>
            <h1>Teste</h1>
            <Link href={"/teste/novo"} >novo</Link>
        </>
    )
}