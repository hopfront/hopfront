import {Box, FormHelperText, Typography} from "@mui/joy"
import {ServerList} from "./ServerList"
import {ServerSelect} from "./ServerSelect"
import {ApiContext} from "@/app/lib/model/ApiContext"
import {OpenAPIV3} from "openapi-types"
import ServerObject = OpenAPIV3.ServerObject;
import Document = OpenAPIV3.Document;
import {getApiServers} from "@/app/lib/openapi/utils"
import {WarningAlert} from "@/app/components/alert/WarningAlert"
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";

type ServerConfigurationProps = {
    apiContext: ApiContext,
    defaultServer: ServerObject | undefined,
    sx?: any
}

export default function ServerConfiguration({apiContext, defaultServer, sx}: ServerConfigurationProps) {
    const extension = apiContext.extension;
    const document = apiContext.apiSpec.document as Document;
    const apiServers = getApiServers(document);

    return (
        <Box sx={{...sx}}>
            <Box>
                {(extension?.servers || []).length === 0 && apiServers.length === 0 &&
                    <WarningAlert title="No default server URLs are configured.">
                        <Typography>You should configure at least one server URL for use with your API.</Typography>
                    </WarningAlert>}
                {(document && defaultServer) && (
                    <>
                        <FormControl>
                            <FormLabel>Active server</FormLabel>
                            <ServerSelect
                                defaultServer={defaultServer}
                                apiContext={apiContext}/>
                            <FormHelperText>
                                This is the server used for all API requests for this specific API.<br/>
                            </FormHelperText>
                        </FormControl>
                    </>

                )}
            </Box>

            {(document) &&
                <Box sx={{mt: 2}}>
                <ServerList apiContext={apiContext} />
                </Box>}
        </Box>)
}