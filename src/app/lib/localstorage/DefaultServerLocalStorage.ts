import {getApiServers} from "@/app/lib/openapi/utils";
import {OpenAPIV3} from "openapi-types";
import ServerObject = OpenAPIV3.ServerObject;
import { OpenAPIDocumentExtension } from "../dto/OpenApiExtensions";

const DEFAULT_API_SERVER_KEY_PREFIX = 'com.hopfront.default-api-server:'

export class DefaultServerLocalStorage {

    public static setDefaultServer(server: ServerObject, apiSpecId: string) {
        if (typeof window === "undefined") {
            return;
        }

        localStorage.setItem(`${DEFAULT_API_SERVER_KEY_PREFIX}${apiSpecId}`, JSON.stringify(server));
    }

    public static getDefaultServer(apiSpecId: string, document: OpenAPIV3.Document, extension: OpenAPIDocumentExtension | undefined): ServerObject | undefined {
        const fallback = getApiServers(document)[0] || extension?.servers[0];
        if (typeof window === "undefined") {
            return fallback;
        }

        let savedServer: ServerObject | undefined;

        const server = localStorage.getItem(`${DEFAULT_API_SERVER_KEY_PREFIX}${apiSpecId}`);
        if (server) {
            try {
                savedServer = JSON.parse(server) as ServerObject;
            } catch (e) { }
        }

        return savedServer ? savedServer : fallback;
    }


}