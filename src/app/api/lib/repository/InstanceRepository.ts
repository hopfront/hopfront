import { fileExists, readFile, writeFile } from "@/app/api/lib/repository/utils";
import { InstanceAdminStatus } from "@/app/lib/model/InstanceAdminStatus";
import { InstanceProperties, InstanceSetup } from "@/app/lib/model/InstanceProperties";;
import { randomUUID } from "crypto";

const _INSTANCE_DIRECTORY = 'instance';
const _INSTANCE_PROPERTIES_FILE = 'properties.json'
const _INSTANCE_ADMIN_STATUS_FILE = 'admin_status.json'

const saveInstanceProperties = (newInstanceConfig: InstanceProperties) => {
    writeFile(_INSTANCE_DIRECTORY, _INSTANCE_PROPERTIES_FILE, JSON.stringify(newInstanceConfig));
}

const saveInstanceAdminStatus = (newAdminStatus: InstanceAdminStatus) => {
    writeFile(_INSTANCE_DIRECTORY, _INSTANCE_ADMIN_STATUS_FILE, JSON.stringify(newAdminStatus));
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
        if (fileExists(_INSTANCE_DIRECTORY, _INSTANCE_ADMIN_STATUS_FILE)) {
            return JSON.parse(readFile(_INSTANCE_DIRECTORY, _INSTANCE_ADMIN_STATUS_FILE)) as InstanceAdminStatus;
        } else {
            const newInstanceAdminStatus: InstanceAdminStatus = {
                isEditable: true
            };

            saveInstanceAdminStatus(newInstanceAdminStatus);
            return newInstanceAdminStatus;
        }
    }

    static saveInstanceAdminStatus(newAdminStatus: InstanceAdminStatus) {
        saveInstanceAdminStatus(newAdminStatus);
    }

    static getAdminPasswordEnvironmentVariable(): string | undefined {
        return process.env.HOPFRONT_ADMIN_PASSWORD;
    }
}