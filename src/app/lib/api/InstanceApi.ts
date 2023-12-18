import { mutateAdminStatus } from "@/app/hooks/useAdminStatus";

export class InstanceApi {
    public static async updateAdminPassword(updateAdminPasswordRequest: InstanceAdminPasswordRequest) {
        return fetch('/api/instance/admin-auth/setups', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateAdminPasswordRequest)
        }).finally(() => {
            mutateAdminStatus();
        })
    }
}