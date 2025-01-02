import { BaseSection } from "@/base/baseSection"
import { UtilTypes } from "@/database/UtilTypes"
import { cookies } from "next/headers"
import { ServerUtilsUseCases } from "../ServerUtilsUseCases"
import moment from "moment"

export class Cookies extends BaseSection<ServerUtilsUseCases> {

    private readonly lastUserKey = "lastUser"

    getSession(): Promise<UtilTypes.Session | null> {

        if (!process.env.sessionKey) {
            throw new Error("process.env.sessionKey não configurada")
        }

        let criptedSession = cookies().get(process.env.sessionKey)

        if (!criptedSession) {
            return Promise.resolve(null)
        }

        return this.instance.CriptManager.decript(criptedSession.value)
    }

    async setSession(data: Partial<UtilTypes.Session>) {

        if (!process.env.sessionKey) {
            throw new Error("process.env.sessionKey não configurada")
        }

        let session = await this.getSession()

        let newSession = Object.assign(session || {}, data) as UtilTypes.Session

        cookies().set(process.env.sessionKey, await this.instance.CriptManager.cript(newSession), {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: newSession.IsMobile ? undefined : moment().add(1, "week").toDate()
        })
    }

    clearSession() {
        if (!process.env.sessionKey) {
            throw new Error("process.env.sessionKey não configurada")
        }

        cookies().delete(process.env.sessionKey)
    }

    async getLastUser() {
        let lastUser = cookies().get(this.lastUserKey)

        if (!lastUser) {
            return null
        }

        let data = await this.instance.CriptManager.decript(lastUser.value) as { IdUser: number }

        return data.IdUser
    }

    async setLastUser(IdUser: number) {
        let value = await this.instance.CriptManager.cript({ IdUser: IdUser })

        cookies().set(this.lastUserKey, value, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: moment().add(10, "years").toDate()
        })
    }

    clearLastUser() {
        cookies().delete(this.lastUserKey)
    }
}