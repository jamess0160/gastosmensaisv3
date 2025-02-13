'use client';

import { useEffect } from "react";
import { serverEventsClient } from "./ServerEventsClient";

export function Sse() {

    let debouncer: NodeJS.Timeout = setTimeout(() => { })

    useEffect(() => {

        clearTimeout(debouncer)

        debouncer = setTimeout(() => {
            serverEventsClient.startSse()
        }, 300);
    }, [])

    return (
        <></>
    )
}