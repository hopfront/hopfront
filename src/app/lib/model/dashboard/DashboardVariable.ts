import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";

export type DashboardVariableType = "text" | "number" | "date" | "foreignKey"

export interface DashboardVariable {
    name: string
    label?: string
    type?: DashboardVariableType
    foreignKeys: ForeignKey[]
}