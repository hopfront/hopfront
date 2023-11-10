import {Box, Stack, Typography} from "@mui/joy"
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OperationLabel} from "@/app/components/typography/OperationLabel";
import ReactMarkdown from "react-markdown";
import {AuthenticationBadge} from "@/app/components/authentication/AuthenticationBadge";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {ServerSelect} from "@/app/api-specs/[apiSpecId]/settings/components/ServerSelect";
import {DefaultServerLocalStorage} from "@/app/lib/localstorage/DefaultServerLocalStorage";

interface OperationHeaderProps {
    operation: StandaloneOperation
    apiContext: ApiContext
}

export const OperationHeader = ({operation, apiContext}: OperationHeaderProps) => {
    const defaultServer = DefaultServerLocalStorage.getDefaultServer(apiContext.apiSpec.id, apiContext.apiSpec.document, apiContext.extension);

    return (
        <>
            <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <Box>
                    <OperationLabel level="title-lg" operation={operation} mode="human"/>
                    {operation.operation.description && operation.operation.description.toUpperCase() != operation.operation.summary?.toUpperCase() ? <Typography level="body-sm">
                        <ReactMarkdown>
                            {operation.operation.description || ''}
                        </ReactMarkdown>
                    </Typography> : <Box sx={{mb: 4}}></Box>}
                </Box>
                <div>
                    <Stack direction="row">
                        {defaultServer && <ServerSelect defaultServer={defaultServer} apiContext={apiContext}/>}
                        <Box sx={{ml: 1}}><AuthenticationBadge apiContext={apiContext}/></Box>
                    </Stack>
                </div>
            </Box>
        </>
    )
}