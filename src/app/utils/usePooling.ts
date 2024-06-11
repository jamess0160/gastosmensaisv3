'use client';

import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";
import axios from "axios";
import { Dispatch, useEffect, useState } from "react";

export function usePooling<T>(url: string, secondsInterval: number, defaultValue?: T): [T | undefined, boolean] {
    let [isLoading, setLoading] = useState(false)
    let [data, setData] = useState(defaultValue)

    useEffect(() => {
        pooling<T>(url, secondsInterval, setData, setLoading)
    }, [])

    return [data, isLoading]
}

async function pooling<T>(url: string, secondsInterval: number, setData: Dispatch<T | undefined>, setLoading: Dispatch<boolean>) {
    setLoading(true)

    try {

        let { data } = await axios.get<T>(url)
        setData(data)

    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
        await clientUtilsUseCases.sleep(secondsInterval)
        pooling(url, secondsInterval, setData, setLoading)
    }
}