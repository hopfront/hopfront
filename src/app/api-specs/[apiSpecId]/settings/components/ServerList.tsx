import {getApiServers, resolveApiBaseUrl} from "@/app/lib/openapi/utils";
import {Delete} from "@mui/icons-material";
import {Box, Button, IconButton, Input, List, ListItem} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {OpenAPIV3} from "openapi-types";
import {ChangeEvent, Fragment, useState} from "react";
import {ExtensionApi} from "@/app/lib/api/ExtensionApi";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {EventType, useSnackbar} from "@/app/hooks/useSnackbar";
import Document = OpenAPIV3.Document;
import ServerObject = OpenAPIV3.ServerObject;
import { Monospace } from "@/app/components/typography/Monospace";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import {InfoAlert} from "@/app/components/alert/InfoAlert";

interface ServerListProps {
    apiContext: ApiContext
}

export const ServerList = ({ apiContext }: ServerListProps) => {
    const apiSpecId = apiContext.apiSpec.id;
    const extension = apiContext.extension;
    const document = apiContext.apiSpec.document as Document;
    const {showSnackbar, Snackbar} = useSnackbar();
    const [saving, setSaving] = useState(false);

    const [baseUrl, setBaseUrl] = useState('');
    const specUrls = getApiServers(document)
        .map((server) => resolveApiBaseUrl(server));

    const extensionServers = extension?.servers || [];

    const onNewCustomUrlSubmit = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (baseUrl && baseUrl.length > 0) {
            setSaving(true);
            const updated = [...extensionServers, { url: baseUrl }];
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
        const updated = extensionServers.filter((extServer) => extServer !== server);
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
                                <Typography>- <Monospace>{url}</Monospace></Typography>
                            </ListItem>
                        </Fragment>
                    )
                })}
                {specUrls.length === 0 && <ListItem><Typography sx={{mx: 1, px: 0}} level="body-sm">No pre-configured server urls</Typography></ListItem>}
                <Typography
                    level="body-xs"
                    textTransform="uppercase"
                    fontWeight="lg"
                    gutterBottom
                    sx={{ mt: 2, ml: 1 }}>
                    Custom Servers
                </Typography>
                <InfoAlert>
                    You can enrich the OpenAPI specification by providing custom servers.
                </InfoAlert>
                {extensionServers.length === 0 && <ListItem><Typography sx={{mx: 1, px: 0}} level="body-sm">- None</Typography></ListItem>}
                {extensionServers.map((server, index) => {
                    return (
                        <Fragment key={'extensionUrls-' + server.url}>
                            <ListItem
                            sx={{mx: 1, px: 0}}
                                key={server.url}
                                endAction={
                                    <IconButton disabled={saving} size="sm" color="danger" onClick={() => onCustomUrlDeleted(server)}>
                                        <Delete />
                                    </IconButton>}>
                                <Monospace>- {server.url}</Monospace>
                            </ListItem>
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
                        disabled={!apiContext.extension}
                        onChange={(event) => {
                            setBaseUrl(event.target.value);
                        }} />
                    <Button
                        sx={{ mt: 1 }}
                        disabled={((baseUrl?.length ?? 0) === 0) || saving || !apiContext.extension}
                        type="submit">
                        Add
                    </Button>
                </form>

                {!apiContext.extension && <>
                    <WarningAlert title="Your API specification is still being processed.">
                        <Typography>
                            <Typography>
                                You will be able to add custom servers later in HopFront settings, when your API is done being processed.
                            </Typography>
                            <br/>
                            <Typography>This might take a few minutes.</Typography>
                        </Typography>
                        <br/>
                    </WarningAlert>
                </>}


                {Snackbar}
            </List>
        </Box>

    );
}