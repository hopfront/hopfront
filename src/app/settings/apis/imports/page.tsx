'use client';

import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { KeyboardArrowRight } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import ImportApiSpec, { ImportMode } from "./components/ImportApiSpec";

export default function Page() {
    const router = useRouter();
    const { usePageView } = useAnalytics();

    usePageView("api-spec-import-page");

    const onSubmitSucceeded = (_: ImportMode, apiSpecId: string) => {
        router.push(`/api-specs/${apiSpecId}/settings`);
    }

    return (
        <>
            <Breadcrumbs separator={<KeyboardArrowRight />} sx={{ p: 0, pb: 1 }}>
                <Link href='/settings' color='neutral'>
                    APIs
                </Link>
                <Typography>Import</Typography>
            </Breadcrumbs>

            <Typography level='h1'>Import API</Typography>
            <ImportApiSpec onImportSucceeded={onSubmitSucceeded} />
        </>
    );
};