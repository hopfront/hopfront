import { ServerLocalStorage } from "@/app/lib/localstorage/ServerLocalStorage";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { getApiServers, resolveApiBaseUrl } from "@/app/lib/openapi/utils";
import { Option, Select } from "@mui/joy";
import { OpenAPIV3 } from "openapi-types";
import { useEffect, useState } from "react";
import ServerObject = OpenAPIV3.ServerObject;

interface ServerSelectProps {
    defaultServer: ServerObject,
    apiContext: ApiContext
    onServerSelected?: (server: ServerObject) => void
}

export const ServerSelect = ({ defaultServer, apiContext, onServerSelected }: ServerSelectProps) => {
    const [selectedServer, setSelectedServer] = useState<ServerObject | null | undefined>()

    useEffect(() => {
        if (selectedServer) {
            ServerLocalStorage.setApiServer(apiContext.apiSpec.id, selectedServer);
            onServerSelected?.(selectedServer);
        }
    }, [selectedServer, apiContext.apiSpec.id])
    const servers = getApiServers(apiContext.apiSpec.document).concat(apiContext.extension.servers);

    return (
        <>
            <Select
                onChange={(_, value) => {
                    setSelectedServer(servers.find((server) => server.url === value));
                }}
                sx={{ maxWidth: '350px' }}
                defaultValue={resolveApiBaseUrl(defaultServer)}
            >
                {servers.map((server) => {
                    const url = resolveApiBaseUrl(server);
                    return <Option key={url} value={url}>{url}</Option>
                })}
            </Select>
        </>
    );
}