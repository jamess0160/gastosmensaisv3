export class LocalStorage {

    public getDeviceKey() {
        return localStorage.getItem("DeviceKey")
    }

    public setDeviceKey(DeviceKey: string) {
        return localStorage.setItem("DeviceKey", DeviceKey)
    }

}