'use client';

import { io } from 'socket.io-client';

const socket = io("http://localhost:3002")

socket.on("reload", (path) => {
    if (location.pathname.includes(path)) {
        location.reload()
    }
})