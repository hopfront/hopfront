import { deleteFile, fileExists, readFile, writeFile } from "@/app/api/lib/repository/utils";
import { InstanceAdminStatus } from "@/app/lib/dto/admin/InstanceAdminStatus";
import { InstanceProperties, InstanceSetup } from "@/app/lib/model/InstanceProperties";
import { randomUUID } from "crypto";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { AuthenticationService } from "../service/AuthenticationService";
;

const _INSTANCE_DIRECTORY = 'instance';
const _INSTANCE_PROPERTIES_FILE = 'properties.json'
const _INSTANCE_ADMIN_AUTH_FILE = 'admin_auth.json'

const saveInstanceProperties = (newInstanceConfig: InstanceProperties) => {
    writeFile(_INSTANCE_DIRECTORY, _INSTANCE_PROPERTIES_FILE, JSON.stringify(newInstanceConfig));
}

const saveInstanceAdminAuth = (newAdminAuth: InstanceAdminAuth) => {
    writeFile(_INSTANCE_DIRECTORY, _INSTANCE_ADMIN_AUTH_FILE, JSON.stringify(newAdminAuth));
}

const getInstanceAdminAuth = (): InstanceAdminAuth | undefined => {
    if (fileExists(_INSTANCE_DIRECTORY, _INSTANCE_ADMIN_AUTH_FILE)) {
        return JSON.parse(readFile(_INSTANCE_DIRECTORY, _INSTANCE_ADMIN_AUTH_FILE)) as InstanceAdminAuth
    } else {
        return undefined;
    }
}

const deleteInstanceAdminAuth = () => {
    deleteFile(_INSTANCE_DIRECTORY, _INSTANCE_ADMIN_AUTH_FILE);
}

export class InstanceRepository {

    static addInstancePropertySetup(setup: InstanceSetup) {
        const instanceProperties = this.getInstanceProperties();

        const setupIndex = instanceProperties.setups.findIndex(s => s.code === setup.code);

        if (setupIndex === -1) {
            instanceProperties.setups.push(setup);
        } else {
            instanceProperties.setups[setupIndex] = setup;
        }

        saveInstanceProperties(instanceProperties);
    }

    static getInstanceProperties(): InstanceProperties {
        if (fileExists(_INSTANCE_DIRECTORY, _INSTANCE_PROPERTIES_FILE)) {
            return JSON.parse(readFile(_INSTANCE_DIRECTORY, _INSTANCE_PROPERTIES_FILE)) as InstanceProperties;
        } else {
            const newInstanceConfig: InstanceProperties = {
                instanceId: process.env.NEXT_PUBLIC_HOPFRONT_INSTANCE_ID || randomUUID(),
                setups: [],
            };

            saveInstanceProperties(newInstanceConfig);
            return newInstanceConfig;
        }
    }

    static getInstanceAdminStatus(): InstanceAdminStatus {
        const envPassword = this.getAdminPasswordEnvironmentVariable();

        if (fileExists(_INSTANCE_DIRECTORY, _INSTANCE_ADMIN_AUTH_FILE)) {
            const adminAuth = JSON.parse(readFile(_INSTANCE_DIRECTORY, _INSTANCE_ADMIN_AUTH_FILE)) as InstanceAdminAuth;

            if (adminAuth && adminAuth.from === 'env' && (!envPassword || envPassword.length === 0)) {
                deleteInstanceAdminAuth(); // env password removed, we clear admin auth configuration
                return {
                    isEnabled: true,
                    isEditable: true
                }
            } else if (adminAuth && adminAuth.from === 'env') {
                return {
                    isEnabled: true,
                    isEditable: false
                }
            } else if (adminAuth && adminAuth.from === 'local' && envPassword && envPassword.length > 0) {
                saveInstanceAdminAuth({ // switching from local to env password overrides local configuration
                    from: 'env',
                    password: envPassword
                })
                return {
                    isEnabled: true,
                    isEditable: false
                }
            } else if (adminAuth && adminAuth.from === 'local' && adminAuth.password && adminAuth.password.length > 0) {
                return {
                    isEnabled: true,
                    isEditable: true
                }
            } else {
                return {
                    isEnabled: false,
                    isEditable: true
                }
            }
        } else if (envPassword && envPassword.length > 0) { // first configuration done by environment variable
            saveInstanceAdminAuth({ from: 'env', password: envPassword })
            return {
                isEnabled: false,
                isEditable: true
            };
        } else { // never configured yet
            return {
                isEnabled: false,
                isEditable: true
            };
        }
    }

    static saveInstanceAdminAuth(newAdminAuth: InstanceAdminAuth) {
        saveInstanceAdminAuth(newAdminAuth);
    }

    static getAdminPasswordEnvironmentVariable(): string | undefined {
        return process.env.HOPFRONT_ADMIN_PASSWORD;
    }

    static isAdminPasswordValid(password: string): boolean {
        const saved = getInstanceAdminAuth()?.password
        if (saved) {
            // TODO hash + salt
            return password === saved
        } else {
            return false;
        }
    }

    static isUserAuthorized(cookies: ReadonlyRequestCookies): boolean {
        const token = cookies.get('accessToken')?.value;
        const adminStatus = this.getInstanceAdminStatus();

        if (adminStatus.isEnabled && (!token || !AuthenticationService.isTokenValid(token))) {
            return false;
        }

        return true;
    }
}