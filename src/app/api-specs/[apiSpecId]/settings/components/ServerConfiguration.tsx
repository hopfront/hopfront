import { Box, Typography } from "@mui/joy"
import { ServerList } from "./ServerList"
import { ServerSelect } from "./ServerSelect"
import { InfoAlert } from "@/app/components/alert/InfoAlert"
import { ApiContext } from "@/app/lib/model/ApiContext"
import { OpenAPIV3 } from "openapi-types"
import ServerObject = OpenAPIV3.ServerObject;
import Document = OpenAPIV3.Document;
import { OpenAPIDocumentExtension } from "@/app/lib/dto/OpenApiExtensions";
import { getApiServers } from "@/app/lib/openapi/utils"
import { WarningAlert } from "@/app/components/alert/WarningAlert"

type ServerConfigurationProps = {
    apiContext: ApiContext,
    defaultServer: ServerObject | undefined,
    sx?: any
}

export default function ServerConfiguration({ apiContext, defaultServer, sx }: ServerConfigurationProps) {
    const extension = apiContext.extension as OpenAPIDocumentExtension;
    const document = apiContext.apiSpec.document as Document;
    const apiServers = getApiServers(document);

    return (
        <Box sx={{ ...sx }}>
            <Box>
                <InfoAlert title="The server used for all API requests for this specific API."
                    sx={{ mb: 1 }}>
                    You can override the OpenAPI specification by providing a custom server.
                </InfoAlert>
                {extension.servers.length === 0 && apiServers.length === 0 &&
                    <WarningAlert title="No default server URLs are configured.">
                        <Typography>You should configure at least one server URL for use with your API.</Typography>
                    </WarningAlert>}
                {(apiContext?.extension && document && defaultServer) && (
                    <ServerSelect
                        defaultServer={defaultServer}
                        apiContext={apiContext} />
                )}
            </Box>

            {(apiContext?.extension && document) &&
                <ServerList
                    apiContext={apiContext}
                />}
        </Box>)
}