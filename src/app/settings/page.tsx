'use client';

import EmptyApiSpecsView from "@/app/browse/components/EmptyApiSpecsView";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { useApiSpecs } from "@/app/hooks/useApiSpecs";
import ApiCard from "@/app/settings/components/ApiCard";
import { FileUpload } from "@mui/icons-material";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useRouter } from "next/navigation";
import AdministratorRoleSettings from "./components/AdministratorRoleSettings";

export default function Page() {
    const router = useRouter();
    const { usePageView } = useAnalytics();
    const { data, error, isLoading } = useApiSpecs();

    usePageView("settings-page");

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
                <EmptyApiSpecsView /> :
                <Box>
                    <Typography level="h1" sx={{ mb: 4 }}>Settings</Typography>
                    <Box>
                        <Box display='flex' alignItems='center' gap={2} sx={{ mb: 1 }}>
                            <Typography level='h3'>API Specifications</Typography>
                            <Button
                                variant="outlined"
                                title='Add an OpenApi specification'
                                onClick={() => router.push('/settings/apis/imports')}
                                startDecorator={<FileUpload />}>
                                Import
                            </Button>
                        </Box>
                        {data.apiSpecs.map(apiSpec => {
                            return (
                                <Box key={apiSpec.id} sx={{ mb: 1 }}>
                                    <ApiCard
                                        api={apiSpec}
                                        href={`./api-specs/${apiSpec.id}/settings`}
                                    />
                                </Box>
                            );
                        })}
                    </Box>

                    {false && <><Box sx={{ mt: 4 }}>
                        <Typography level='h3' gutterBottom>Instance settings</Typography>
                        <Typography level='title-lg'>Administrator permissions</Typography>
                    </Box>
                    <AdministratorRoleSettings /></>}
                </Box>}
        </Box>
    );
}
