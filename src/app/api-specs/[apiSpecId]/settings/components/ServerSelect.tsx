import { getApiServers, resolveApiBaseUrl } from "@/app/lib/openapi/utils";
import { Option, Select } from "@mui/joy";
import { OpenAPIV3 } from "openapi-types";
import { useEffect, useState } from "react";
import { DefaultServerLocalStorage } from "@/app/lib/localstorage/DefaultServerLocalStorage";
import { ApiContext } from "@/app/lib/model/ApiContext";
import ServerObject = OpenAPIV3.ServerObject;

interface ServerSelectProps {
    defaultServer: ServerObject,
    apiContext: ApiContext
}

export const ServerSelect = ({ defaultServer, apiContext }: ServerSelectProps) => {
    const [selectedServer, setSelectedServer] = useState<ServerObject | null | undefined>()

    useEffect(() => {
        if (selectedServer) {
            DefaultServerLocalStorage.setDefaultServer(selectedServer, apiContext.apiSpec.id);
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