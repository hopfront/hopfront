import {OpenAPIDocumentExtension} from "@/app/lib/dto/OpenApiExtensions";
import {getApiServers, resolveApiBaseUrl} from "@/app/lib/openapi/utils";
import {Delete} from "@mui/icons-material";
import {Box, Button, IconButton, Input, List, ListDivider, ListItem, ListItemButton} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {OpenAPIV3} from "openapi-types";
import {ChangeEvent, Fragment, useState} from "react";
import {ExtensionApi} from "@/app/lib/api/ExtensionApi";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {EventType, useSnackbar} from "@/app/hooks/useSnackbar";
import Document = OpenAPIV3.Document;
import ServerObject = OpenAPIV3.ServerObject;
import { Monospace } from "@/app/components/typography/Monospace";

interface ServerListProps {
    apiContext: ApiContext
}

export const ServerList = ({ apiContext }: ServerListProps) => {
    const apiSpecId = apiContext.apiSpec.id;
    const extension = apiContext.extension as OpenAPIDocumentExtension;
    const document = apiContext.apiSpec.document as Document;
    const {showSnackbar, Snackbar} = useSnackbar();
    const [saving, setSaving] = useState(false);

    const [baseUrl, setBaseUrl] = useState('');
    const specUrls = getApiServers(document)
        .map((server) => resolveApiBaseUrl(server));

    const onNewCustomUrlSubmit = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (baseUrl && baseUrl.length > 0) {
            setSaving(true);
            const updated = [...extension.servers, { url: baseUrl }];
            ExtensionApi.updateExtensionServers(apiSpecId, updated)
                .then(() => showSnackbar(EventType.Success, 'Server added successfully'))
                .finally(() => {
                    setSaving(false);
                    setBaseUrl('');
                });
        }
    }

    const onCustomUrlDeleted = (server: ServerObject) => {
        setSaving(true);
        const updated = extension.servers.filter((extServer) => extServer !== server);
        ExtensionApi.updateExtensionServers(apiSpecId, updated)
            .then(() => showSnackbar(EventType.Success, 'Deleted server successfully'))
            .finally(() => setSaving(false));
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
                    Pre-configured Servers
                </Typography>
                {specUrls.map((url, index) => {
                    return (
                        <Fragment key={'specUrls-' + url}>
                            <ListItem sx={{mx: 1, px: 0}}>
                                <Typography><Monospace>{url}</Monospace></Typography>
                            </ListItem>
                            {index < specUrls.length - 1 && <ListDivider inset='gutter' />}
                        </Fragment>
                    )
                })}
                {specUrls.length === 0 && <ListItem><Typography sx={{mx: 1, px: 0}} level="body-sm">No pre-configured server urls</Typography></ListItem>}
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
                                    <IconButton disabled={saving} size="sm" color="danger" onClick={() => onCustomUrlDeleted(server)}>
                                        <Delete />
                                    </IconButton>}>
                                <Monospace>{server.url}</Monospace>
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
                        disabled={((baseUrl?.length ?? 0) === 0) || saving}
                        type="submit">
                        Add
                    </Button>
                </form>

                {Snackbar}
            </List>
        </Box>

    );
}