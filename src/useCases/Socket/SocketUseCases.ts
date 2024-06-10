import { io } from 'socket.io-client';

class SocketUseCases {

    private readonly socket = io("http://localhost:3002")

    constructor() {
        this.socket.on("reload", (path) => {

            if (("location" in global) == false) return

            if (global.location.pathname.includes(path)) {
                location.reload()
            }
        })
    }

    emmitReloadRequest(path: string) {
        this.socket.emit("requestReload", path)
    }
}

export const socketUseCases = new SocketUseCases()