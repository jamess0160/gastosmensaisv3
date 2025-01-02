'use client';

import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import axios from "axios";
import moment from "moment";
import { Dispatch, useEffect, useState } from "react";

export function usePooling<T>(url: string, secondsInterval: number, options?: PoolingOptions<T>): PooolingReturn<T> {
    let [isLoading, setLoading] = useState(false)
    let [data, setData] = useState(options?.defaultValue)

    useEffect(() => {

        pooling<T>(url, setData, setLoading, options)

        let cleared = false

        async function recursive() {

            if (cleared) {
                return
            }

            await pooling(url, setData, setLoading, options)

            await clientUtilsUseCases.sleep(moment.duration(secondsInterval, "seconds").asMilliseconds())

            recursive()
        }

        recursive()

        return () => {
            cleared = true
        }

    }, [])

    return {
        data,
        isLoading,
        force() {
            return pooling(url, setData, setLoading, options)
        },
    }
}

async function pooling<T>(url: string, setData: Dispatch<T | undefined>, setLoading: Dispatch<boolean>, options?: PoolingOptions<T>) {
    setLoading(true)

    try {
        let { data } = await axios.get<T>(url, { params: options?.params })
        setData(data)

    } catch (error) {
        clientUtilsUseCases.HandleError.run(error, `Ocorreu um erro ao executar a rota: ${url}`)
    } finally {
        setLoading(false)
    }
}

interface PoolingOptions<T> {
    defaultValue?: T
    params?: Record<string, any>
}

interface PooolingReturn<T> {
    data: T | undefined,
    isLoading: boolean
    force: () => Promise<void>
}