export interface UpdatableValue<T> {
    value: T | undefined
    onValueUpdate: (value: T | undefined) => void
}