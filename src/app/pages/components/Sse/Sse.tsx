'use client';

import { useEffect } from "react";
import { serverEventsClient } from "./ServerEventsClient";

export function Sse() {

    let debouncer: NodeJS.Timeout = setTimeout(() => { })

    useEffect(() => {

        clearTimeout(debouncer)

        debouncer = setTimeout(() => {
            serverEventsClient.run()
        }, 300);
    }, [])

    return (
        <></>
    )
}