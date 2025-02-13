import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import axios from "axios"
import { dialogs } from "../Dialogs/dialogs"
import { UtilTypes } from "@/database/UtilTypes"

class ServerEventsClient {

    private readonly actions: Record<string, ActionFn> = {
        default: this.defaultAction
    }

    private defaultAction(data: { message: string }) {
        return dialogs.Confirm.show(data.message)
    }

    public subscribeAction<T>(actionKey: string, fn: ActionFn<T>) {
        this.actions[actionKey] = fn
    }

    public async startSse() {
        try {

            let stream = new EventSource('/api/sse')

            stream.onmessage = async (streamData) => {
                try {

                    let data = JSON.parse(streamData.data) as SseData

                    let response = await this.getActionResponse(data)

                    await this.sendResponse(data.key, response)

                } catch (error) {
                    clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro ao carregar o SSE")
                }
            }
        } catch (error) {
            clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro no SSE")
        }
    }

    private async getActionResponse(data: SseData) {
        let action = this.actions[data.type || "default"]

        let result = action(data.data)

        if (result instanceof Promise) {
            return await result
        }

        return result
    }

    private sendResponse(key: string, response: any) {
        return axios.post("/api/sse/response", { key, response })
    }
}

export const serverEventsClient = new ServerEventsClient()

type ActionFn<T = any> = (data: T) => UtilTypes.MaybePromise<any>

interface SseData {
    data: any
    key: string
    type?: string
}