'use client'

import { ApiSpecsApi } from "@/app/lib/api/ApiSpecsApi";
import { CircularProgress, Textarea } from "@mui/joy";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import { useState } from "react";
import { ImportMode } from "./ImportApiSpec";
import SkipNoDefaultServersModal from "./SkipNoDefaultServersModal";
import {Problem} from "@/app/lib/dto/Problem";

type TextApiSpecImportProps = {
    onTextImportSucceeded: (mode: ImportMode, apiSpecId: string) => void,
    onTextApiImportFailed: (problem: Problem) => void,
    showWarningModal: boolean,
    onWarningModalClose: () => void
    onLoading: (loading: boolean) => void
}

export default function TextApiSpecImport({ onTextImportSucceeded, onTextApiImportFailed, showWarningModal, onLoading, onWarningModalClose }: TextApiSpecImportProps) {
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState<string | undefined>();

    function onFormSubmit() {
        if (!text) {
            return;
        }

        importApi(text, false);
    }

    const importApi = (text: string, skipDefaultServersRequirement: boolean) => {
        setLoading(true);
        onLoading(true);

        ApiSpecsApi.importApiSpecAsPlainText(text, skipDefaultServersRequirement)
            .then(apiSpecId => onTextImportSucceeded('file', apiSpecId))
            .catch((problem: Problem) => onTextApiImportFailed(problem))
            .finally(() => {
                setLoading(false);
                onLoading(false);
            });
    }

    const importApiWithoutDefaultServers = () => {
        onWarningModalClose();
        if (!text) {
            return;
        }

        importApi(text, true);
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

            <SkipNoDefaultServersModal
                showModal={showWarningModal}
                onCancel={() => onWarningModalClose()}
                onContinue={() => importApiWithoutDefaultServers()} />
        </>
    )
};