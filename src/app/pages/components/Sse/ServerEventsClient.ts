import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import axios from "axios"
import { dialogs } from "../Dialogs/dialogs"

class ServerEventsClient {
    public async run() {
        try {

            let stream = new EventSource('/api/sse')

            stream.onmessage = async (streamData) => {
                try {

                    let data = JSON.parse(streamData.data) as SseData

                    let response = await dialogs.Confirm.show(data.message)

                    await this.sendResponse(data.key, response)

                } catch (error) {
                    clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro ao carregar o SSE")
                }
            }
        } catch (error) {
            clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro no SSE")
        }
    }

    private sendResponse(key: string, response: boolean) {
        return axios.post("/api/sse/response", { key, response })
    }
}

export const serverEventsClient = new ServerEventsClient()

interface SseData {
    message: string
    key: string
}