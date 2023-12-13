import { ApiErrorCode } from "@/app/common/ApiErrorCode"

// https://github.com/zalando/problem
export interface Problem {
    title: string
    status: number
    detail?: string,
    codes?: ApiErrorCode[]
}