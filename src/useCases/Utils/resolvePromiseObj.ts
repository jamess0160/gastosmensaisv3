
export async function resolvePromiseObj<T extends Record<string, Promise<any>>>(promises: T): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
    let arrayKeys = Object.keys(promises)
    let resultPromisses = await Promise.all(Object.values(promises))

    return resultPromisses.reduce((old, item, index) => {
        old[arrayKeys[index]] = item

        return old
    }, {})
}