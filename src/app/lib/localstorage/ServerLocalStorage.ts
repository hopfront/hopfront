import { getApiServers } from "@/app/lib/openapi/utils";
import { OpenAPIV3 } from "openapi-types";
import { ApiContext } from "../model/ApiContext";
import ServerObject = OpenAPIV3.ServerObject;

const DEFAULT_API_SERVER_KEY_PREFIX = 'com.hopfront.default-api-server:'

export class ServerLocalStorage {

    public static setApiServer(apiSpecId: string, server: ServerObject) {
        if (typeof window === "undefined") {
            return;
        }

        localStorage.setItem(`${DEFAULT_API_SERVER_KEY_PREFIX}${apiSpecId}`, JSON.stringify(server));
    }

    public static getApiServer(apiContext: ApiContext): ServerObject | undefined {
        const fallback = getApiServers(apiContext.apiSpec.document)[0] || apiContext.extension?.servers[0];
        if (typeof window === "undefined") {
            return fallback;
        }

        let savedServer: ServerObject | undefined;

        const server = localStorage.getItem(`${DEFAULT_API_SERVER_KEY_PREFIX}${apiContext.apiSpec.id}`);
        if (server) {
            try {
                savedServer = JSON.parse(server) as ServerObject;
            } catch (e) { }
        }

        return savedServer ? savedServer : fallback;
    }
}