import { mutateAdminInfo } from "@/app/hooks/useAdminInfo";
import { AdminAuthRequest } from "../dto/admin/auth/AdminAuthRequest";

export class InstanceApi {
    public static async authenticateAdmin(adminAuthRequest: AdminAuthRequest) {
        return fetch('/api/instance/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminAuthRequest)
        })
    }

    public static async logoutAdmin() {
        return fetch('api/instance/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    public static async disableAdminRole() {
        return fetch('api/instance/auth/disable', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    public static async enableAdminRole(enableAdminRoleRequest: EnableAdminRoleRequest) {
        return fetch('/api/instance/auth/enable', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enableAdminRoleRequest)
        }).finally(() => {
            mutateAdminInfo();
        })
    }

    public static async updateAdminPassword(updateAdminPasswordRequest: UpdateAdminPasswordRequest) {
        return fetch('/api/instance/auth/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateAdminPasswordRequest)
        }).finally(() => {
            mutateAdminInfo();
        })
    }
}