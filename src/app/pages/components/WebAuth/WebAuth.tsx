'use client';
import { useEffect } from "react";
import { HandleWebAuth } from "./sections/handleWebAuth/handleWebAuth";

export function WebAuth() {

    let debouncer: NodeJS.Timeout = setTimeout(() => { })

    useEffect(() => {
        if (!navigator.credentials) {
            return
        }

        clearTimeout(debouncer)

        debouncer = setTimeout(() => {
            new HandleWebAuth().run({ postLogin: true })
        }, 300);
    }, [])

    return <div />
}