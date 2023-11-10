import { createContext } from "react"

type ArrayContext = {
    level: number
}

const defaultValues = { level: 1 } as ArrayContext
export const ArrayContext = createContext(defaultValues)