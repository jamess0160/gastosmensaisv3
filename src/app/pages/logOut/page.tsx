'use client';

import axios from "axios";
import { useEffect } from "react";

export default function Page() {

    useEffect(() => {
        async function main() {
            axios.post("/api/logOut").finally(() => {
                location.pathname = "/pages/login"
            })
        }

        main()
    })
}