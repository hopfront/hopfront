'use client'

import { useApiContext } from "@/app/hooks/useApiContext";
import ImportApiSpec from "@/app/settings/apis/imports/components/ImportApiSpec";
import { Skeleton, Typography } from "@mui/joy";
import { useParams } from "next/navigation";
import { useState } from "react";
import { UpdateSucceededModal } from "./components/UpdateSucceededModal";

export default function Page() {
    const apiSpecId = decodeURIComponent(useParams()['apiSpecId'] as string);
    const { data: apiContext, error, isLoading } = useApiContext(apiSpecId);
    const [updateSucceededModal, setUpdateSucceededModal] = useState(false);

    const onSubmitSucceeded = () => {
        setUpdateSucceededModal(true);
    }

    return (
        <>
            <Typography level="h1" gutterBottom>
                <Skeleton loading={isLoading}>Update {apiContext?.apiSpec.document.info.title}</Skeleton>
            </Typography>

            <ImportApiSpec onImportSucceeded={onSubmitSucceeded} isUpdateMode apiSpecId={apiSpecId} />
            <UpdateSucceededModal open={updateSucceededModal} onClose={() => setUpdateSucceededModal(false)} />
        </>
    )
}