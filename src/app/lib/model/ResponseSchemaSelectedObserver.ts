export interface ResponseSchemaSelectedObserver {
    schemaRef: string
    onValueSelected: (value: any) => void
}