'use client';

import ApiCard from "@/app/settings/components/ApiCard";
import EmptyApiSpecsView from "@/app/browse/components/EmptyApiSpecsView";
import {useApiSpecs} from "@/app/hooks/useApiSpecs";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import {useRouter} from "next/navigation";
import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";
import {IconButton, Link, Table} from "@mui/joy";
import {useInstanceProperties} from "@/app/hooks/useInstanceProperties";
import {Monospace} from "@/app/components/typography/Monospace";
import {Edit, FileUpload} from "@mui/icons-material";
import ButtonGroup from "@mui/joy/ButtonGroup";
import {InfoAlert} from "@/app/components/alert/InfoAlert";

export default function Page() {
    const router = useRouter();
    const {usePageView} = useAnalytics();
    const {data: properties, error: propertiesError, isLoading: propertiesLoading} = useInstanceProperties();
    const {data, error, isLoading} = useApiSpecs();

    usePageView("settings-page");

    const oAuthProviders = properties?.oauthProviders || [];

    if (isLoading) {
        return <div>loading...</div>
    }

    if (error) {
        return <div>{JSON.stringify(error)}</div>
    }

    if (!data) {
        return null;
    }

    return (
        <Box>
            {data.apiSpecs.length === 0 ?
                <EmptyApiSpecsView/> :
                <>
                    <Typography level="h1" sx={{mb: 4}}>HopFront Settings</Typography>
                    <Box sx={{mb: 4}}>
                        <Box display='flex' alignItems='center' gap={2} sx={{mb: 1}}>
                            <Typography level='h2'>API Specifications</Typography>
                            <Button
                                variant="outlined"
                                title='Add an OpenApi specification'
                                onClick={() => router.push('/settings/apis/imports')}
                                startDecorator={<FileUpload/>}>
                                Import
                            </Button>
                        </Box>
                        {data.apiSpecs.map(apiSpec => {
                            return (
                                <Box key={apiSpec.id} sx={{mb: 1}}>
                                    <ApiCard
                                        api={apiSpec}
                                        href={`./api-specs/${apiSpec.id}/settings`}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                    <Box>
                        <Box display='flex' alignItems='center' gap={2} sx={{mb: 1}}>
                            <Typography level='h2'>OAuth Providers</Typography>
                        </Box>
                        {oAuthProviders.length === 0 && <>
                            <InfoAlert title="OAuth Providers allow you to share authentication across multiple APIs in a standard way.">
                                <Typography>There are many OAuth Providers available, <Link href="https://www.keycloak.org/" target="_blank">KeyCloack</Link> being the leading Open Source example.</Typography>
                            </InfoAlert>
                        </>}
                        {oAuthProviders.length > 0 && <Table>
                            <thead>
                            <tr>
                                <th>Alias</th>
                                <th>Client ID</th>
                                <th>Authorization Endpoint</th>
                                <th>Token Endpoint</th>
                                <th>Scopes</th>
                                <th style={{ width: '5%' }}></th>
                            </tr>
                            </thead>
                            <tbody>
                            {oAuthProviders.map(op => {
                                return (
                                    <tr key={op.id}>
                                        <td><Typography level="title-md">{op.alias}</Typography></td>
                                        <td><Monospace>{op.clientId}</Monospace></td>
                                        <td><Monospace>{op.authorizationEndpoint}</Monospace></td>
                                        <td><Monospace>{op.tokenEndpoint}</Monospace></td>
                                        <td><Monospace>{op.scope.split(' ').map(s => <Typography key={s} variant="outlined" sx={{mr: 1}}>{s}</Typography>)}</Monospace></td>
                                        <td>
                                            <ButtonGroup>
                                                <IconButton>
                                                    <Edit/>
                                                </IconButton>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>}
                    </Box>
                </>}
        </Box>
    );
}
