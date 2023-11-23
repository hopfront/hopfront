import { fileExists, readFile, writeFile } from "@/app/api/lib/repository/utils";
import { InstanceProperties, InstanceSetup } from "@/app/lib/model/InstanceProperties";
import { randomUUID } from "crypto";

const _INSTANCE_DIRECTORY = 'instance';
const _INSTANCE_PROPERTIES_FILE = 'properties.json'

const saveInstanceProperties = (newInstanceConfig: InstanceProperties) => {
    writeFile(_INSTANCE_DIRECTORY, _INSTANCE_PROPERTIES_FILE, JSON.stringify(newInstanceConfig));
}

export class HopFrontPropertiesRepository {

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
}