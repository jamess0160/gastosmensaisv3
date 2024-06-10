export abstract class BaseSection<T>{
    protected readonly instance: T

    constructor(instance: T) {
        this.instance = instance
    }
}