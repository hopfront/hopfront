import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";

export interface VariableWithValue {
    variable: DashboardVariable
    value: string | undefined
}
