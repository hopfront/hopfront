import { mutateAdminInfo } from "@/app/hooks/useAdminInfo";
import { AdminAuthRequest } from "../dto/AdminAuthRequest";

export class InstanceApi {
    public static async updateAdminPassword(updateAdminPasswordRequest: InstanceAdminPasswordRequest) {
        return fetch('/api/instance/admin/auth/setups', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateAdminPasswordRequest)
        }).finally(() => {
            mutateAdminInfo();
        })
    }

    public static async authenticateAdmin(adminAuthRequest: AdminAuthRequest) {
        return fetch('/api/instance/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminAuthRequest)
        })
    }
}