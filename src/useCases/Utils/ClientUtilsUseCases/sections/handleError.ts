import { dialogs } from "@/app/pages/components/Dialogs/dialogs"
import axios, { AxiosError } from "axios"

export class HandleError {

    public run(error: any, title: string) {

        if (error instanceof AxiosError && error.response?.status === 406) {
            return this.handleServerMessage(title, error.response.data)
        }

        console.log(error)

        axios.post("/api/logs", {
            type: `Log navegador: ${title}`,
            msg: error.toString(),
            stack: error.stack?.split("\n"),
            hash: location.hash,
            data: error.response?.data
        }).catch(() => { })

        return dialogs.Error.show(title)
    }

    private handleServerMessage(title: string, data: any) {
        if (data.type === "error") {
            return dialogs.Error.show(data.msg, title)
        }

        if (data.type === "redirect") {
            location.href = data.url
        }
    }
}