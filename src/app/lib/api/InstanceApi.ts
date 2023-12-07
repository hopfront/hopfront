import { mutateAdminStatus } from "@/app/hooks/useAdminStatus";
import { InstanceAdminStatus } from "../model/InstanceAdminStatus";

export class InstanceApi {
    public static async saveAdminStatus(adminStatus: InstanceAdminStatus) {
        return fetch('/api/instance/admin-status/setups', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminStatus)
        }).finally(() => {
            mutateAdminStatus();
        })
    }
}