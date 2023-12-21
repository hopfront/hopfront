import { InstanceAdminStatus } from "./InstanceAdminStatus";

export interface InstanceAdminInfoResponse {
    adminStatus: InstanceAdminStatus
    isAuthenticated: boolean
}