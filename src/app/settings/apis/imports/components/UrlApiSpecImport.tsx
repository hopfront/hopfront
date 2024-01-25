import { ManualInput } from "@/app/components/input/ManualInput";
import { ApiSpecsApi } from "@/app/lib/api/ApiSpecsApi";
import { Problem } from "@/app/lib/dto/Problem";
import { FormHelperText } from "@mui/joy";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { ChangeEvent, useState } from "react";
import { ImportMode } from "./ImportApiSpec";
import SkipSpecImportWarningsModal from "./SkipSpecImportWarningsModal";
import { UpdateSpecWarningModal } from "./UpdateSpecWarningModal";

type UrlApiSpecImportProps = {
    onUrlImportSucceeded: (mode: ImportMode, apiSpecId: string) => void
    onUrlImportFailed: (error: Problem) => void
    warningModalProblem: Problem | undefined
    onWarningModalClose: () => void
    onLoading: (loading: boolean) => void
    isUpdateMode?: boolean
    apiSpecId?: string
}

export default function UrlApiSpecImport({
    onUrlImportSucceeded,
    onUrlImportFailed,
    warningModalProblem,
    onWarningModalClose,
    onLoading,
    isUpdateMode = false,
    apiSpecId
}: UrlApiSpecImportProps) {
    const [url, setUrl] = useState<string | undefined>('');
    const [isLoading, setLoading] = useState(false);
    const [updateWarningModal, setUpdateWarningModal] = useState(false);

    function onFormSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!url) return;

        if (isUpdateMode) {
            setUpdateWarningModal(true);
        } else {
            importApi(url, false);
        }
    }

    const updateApi = (apiSpecId: string, url: string, skipSpecImportWarnings: boolean) => {
        setLoading(true);

        ApiSpecsApi
            .updateApiSpecByUrl(apiSpecId, url, skipSpecImportWarnings)
            .then((apiSpecId) => onUrlImportSucceeded('url', apiSpecId))
            .catch((problem: Problem) => onUrlImportFailed(problem))
            .finally(() => {
                setLoading(false);
                onLoading(false);
            });
    }

    const importApiSkippingWarnings = () => {
        if (!url) return;

        onWarningModalClose();

        if (isUpdateMode && apiSpecId) {
            updateApi(apiSpecId, url, true);
        } else {
            importApi(url, true);
        }
    }

    const importApi = (url: string, skipWarningsOnImport: boolean) => {
        setLoading(true);
        onLoading(true);

        ApiSpecsApi
            .importApiSpecAsUrl(url, skipWarningsOnImport)
            .then(apiSpecId => onUrlImportSucceeded('url', apiSpecId))
            .catch((problem: Problem) => onUrlImportFailed(problem))
            .finally(() => {
                setLoading(false);
                onLoading(false);
            });
    }

    return (
        <>
            <form
                onSubmit={onFormSubmit}>
                <FormControl>
                    <FormLabel>OpenAPI Specification URL</FormLabel>
                    <ManualInput
                        required={true}
                        type="url"
                        disabled={isLoading}
                        updatableValue={{
                            value: url,
                            onValueUpdate: (value) => setUrl(value as string)
                        }}
                        placeholder="https://petstore3.swagger.io/api/v3/openapi.json" />
                    <FormHelperText>The URL of your OpenAPI specification file (JSON or YAML).</FormHelperText>
                </FormControl>
                <Button
                    type="submit"
                    loading={isLoading}
                    loadingPosition='end'
                    sx={{ mt: 3 }}>
                    Import
                </Button>

                <SkipSpecImportWarningsModal
                    showModal={warningModalProblem != undefined}
                    onCancel={() => onWarningModalClose()}
                    onContinue={() => importApiSkippingWarnings()}
                    problem={warningModalProblem} />
            </form>

            <UpdateSpecWarningModal
                open={updateWarningModal}
                onClose={() => { setUpdateWarningModal(false) }}
                onProceed={() => {
                    if (apiSpecId && url) {
                        setUpdateWarningModal(false);
                        updateApi(apiSpecId, url, false);
                    }
                }} />
        </>
    )
};