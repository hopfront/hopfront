'use client'

import { ApiSpecsApi } from "@/app/lib/api/ApiSpecsApi";
import { Problem } from "@/app/lib/dto/Problem";
import { CircularProgress, Textarea } from "@mui/joy";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import { useState } from "react";
import { ImportMode } from "./ImportApiSpec";
import SkipSpecImportWarningsModal from "./SkipSpecImportWarningsModal";
import { UpdateSpecWarningModal } from "./UpdateSpecWarningModal";

type TextApiSpecImportProps = {
    onTextImportSucceeded: (mode: ImportMode, apiSpecId: string) => void,
    onTextApiImportFailed: (problem: Problem) => void,
    warningModalProblem: Problem | undefined,
    onWarningModalClose: () => void
    onLoading: (loading: boolean) => void
    isUpdateMode?: boolean
    apiSpecId?: string
}

export default function TextApiSpecImport({
    onTextImportSucceeded,
    onTextApiImportFailed,
    warningModalProblem,
    onLoading,
    onWarningModalClose,
    isUpdateMode = false,
    apiSpecId
}: TextApiSpecImportProps) {
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState<string | undefined>();
    const [updateWarningModal, setUpdateWarningModal] = useState(false);

    function onFormSubmit() {
        if (!text) return;

        if (isUpdateMode) {
            setUpdateWarningModal(true);
        } else {
            importApi(text, false);
        }
    }

    const importApi = (text: string, skipSpecImportWarnings: boolean) => {
        setLoading(true);
        onLoading(true);

        ApiSpecsApi.importApiSpecAsPlainText(text, skipSpecImportWarnings)
            .then(apiSpecId => onTextImportSucceeded('file', apiSpecId))
            .catch((problem: Problem) => onTextApiImportFailed(problem))
            .finally(() => {
                setLoading(false);
                onLoading(false);
            });
    }

    const updateApi = (apiSpecId: string, text: string, skipSpecImportWarnings: boolean) => {
        if (!text) return;

        setLoading(true);

        ApiSpecsApi.updateApiSpecByPlainText(apiSpecId, text, skipSpecImportWarnings)
            .then(apiSpecId => onTextImportSucceeded('file', apiSpecId))
            .catch((problem: Problem) => onTextApiImportFailed(problem))
            .finally(() => {
                setLoading(false);
                onLoading(false);
            });;
    }

    const importApiSkippingWarnings = () => {
        if (!text) return;

        onWarningModalClose();

        if (isUpdateMode && apiSpecId) {
            updateApi(apiSpecId, text, true);
        } else {
            importApi(text, true);
        }
    }

    return (
        <>
            <FormControl>
                <FormLabel>Open Api file</FormLabel>
                <Textarea
                    required={true}
                    disabled={loading}
                    onChange={event => {
                        setText(event.target.value);
                    }}
                    minRows={10}
                    maxRows={20}
                    placeholder={`{
     "swagger": "3.0",
     "info": {
                ...
     }
}`} />
                <FormHelperText>The content of your OpenAPI specifications (JSON or YAML).</FormHelperText>
            </FormControl>

            <Button
                onClick={onFormSubmit}
                disabled={loading}
                endDecorator={loading && <CircularProgress
                    variant="plain"
                    thickness={2}
                    sx={{ '--CircularProgress-size': '16px' }}
                />}
                sx={{ mt: 3 }}>
                Import
            </Button>

            <SkipSpecImportWarningsModal
                showModal={warningModalProblem != undefined}
                onCancel={() => onWarningModalClose()}
                onContinue={() => importApiSkippingWarnings()}
                problem={warningModalProblem} />

            <UpdateSpecWarningModal
                onProceed={() => {
                    if (text && apiSpecId) {
                        setUpdateWarningModal(false);
                        updateApi(apiSpecId, text, false);
                    }
                }}
                open={updateWarningModal}
                onClose={() => { setUpdateWarningModal(false) }} />
        </>
    )
};