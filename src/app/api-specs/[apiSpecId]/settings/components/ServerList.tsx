import { OpenAPIDocumentExtension } from "@/app/lib/dto/OpenApiExtensions";
import { getApiServers, resolveApiBaseUrl } from "@/app/lib/openapi/utils";
import { Delete } from "@mui/icons-material";
import { Box, Button, IconButton, Input, List, ListDivider, ListItem, ListItemButton } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import { OpenAPIV3 } from "openapi-types";
import { ChangeEvent, Fragment, useState } from "react";
import { ExtensionApi } from "@/app/lib/api/ExtensionApi";
import Document = OpenAPIV3.Document;
import ServerObject = OpenAPIV3.ServerObject;
import { ApiContext } from "@/app/lib/model/ApiContext";

interface ServerListProps {
    apiContext: ApiContext
}

export const ServerList = ({ apiContext }: ServerListProps) => {
    const apiSpecId = apiContext.apiSpec.id;
    const extension = apiContext.extension as OpenAPIDocumentExtension;
    const document = apiContext.apiSpec.document as Document;

    const [baseUrl, setBaseUrl] = useState('');
    const specUrls = getApiServers(document)
        .map((server) => resolveApiBaseUrl(server));

    const onNewCustomUrlSubmit = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (baseUrl && baseUrl.length > 0) {
            const updated = [...extension.servers, { url: baseUrl }];
            ExtensionApi.updateExtensionServers(apiSpecId, updated);
            setBaseUrl('');
        }
    }

    const onCustomUrlDeleted = (server: ServerObject) => {
        const updated = extension.servers.filter((extServer) => extServer !== server);
        ExtensionApi.updateExtensionServers(apiSpecId, updated)
    };

    return (
        <Box sx={{mt: 1}}>
            <List sx={{ maxWidth: '350px', borderRadius: 'sm', p: 1, pb: 2 }} variant="outlined">
                <Typography
                    level="body-xs"
                    textTransform="uppercase"
                    fontWeight="lg"
                    gutterBottom
                    sx={{ mt: 1, ml: 1 }}>
                    Predefined Servers
                </Typography>
                {specUrls.map((url, index) => {
                    return (
                        <Fragment key={'specUrls-' + url}>
                            <ListItemButton disabled sx={{mx: 1, px: 0}}>
                                {url}
                            </ListItemButton>
                            {index < specUrls.length - 1 && <ListDivider inset='gutter' />}
                        </Fragment>
                    )
                })}
                {specUrls.length === 0 && <ListItem><Typography sx={{mx: 1, px: 0}} level="body-sm">No predefined server urls</Typography></ListItem>}
                <Typography
                    level="body-xs"
                    textTransform="uppercase"
                    fontWeight="lg"
                    gutterBottom
                    sx={{ mt: 1, ml: 1 }}>
                    Custom Servers
                </Typography>
                {extension.servers.length === 0 && <ListItem><Typography sx={{mx: 1, px: 0}} level="body-sm">No custom server urls</Typography></ListItem>}
                {extension.servers.map((server, index) => {
                    return (
                        <Fragment key={'extensionUrls-' + server.url}>
                            <ListItem
                            sx={{mx: 1, px: 0}}
                                key={server.url}
                                endAction={
                                    <IconButton size="sm" color="danger" onClick={() => onCustomUrlDeleted(server)}>
                                        <Delete />
                                    </IconButton>}>
                                {server.url}
                            </ListItem>
                            {index < extension.servers.length - 1 && <ListDivider inset='gutter' />}
                        </Fragment>
                    )
                })}

                <form
                    onSubmit={onNewCustomUrlSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginRight: '8px',
                        marginLeft: '8px'
                    }}>
                    <Input
                        sx={{ mt: 1 }}
                        value={baseUrl}
                        onChange={(event) => {
                            setBaseUrl(event.target.value);
                        }} />
                    <Button
                        sx={{ mt: 1 }}
                        disabled={(baseUrl?.length ?? 0) === 0}
                        type="submit">
                        Add
                    </Button>
                </form>

            </List>
        </Box>

    );
}