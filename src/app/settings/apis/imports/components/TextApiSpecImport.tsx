'use client'

import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ApiSpecsApi } from "@/app/lib/api/ApiSpecsApi";
import { getRestrictedApiUrls } from "@/app/lib/openapi/utils";
import { CircularProgress, Textarea } from "@mui/joy";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ImportMode } from "./ImportApiSpec";
import SkipNoDefaultServersModal from "./SkipNoDefaultServersModal";

type TextApiSpecImportProps = {
    onTextImportSucceeded: (mode: ImportMode, apiSpecId: string) => void,
    onTextApiImportFailed: (error: any) => void,
    showWarningModal: boolean,
    onWarningModalClose: () => void
}

export default function TextApiSpecImport({ onTextImportSucceeded, onTextApiImportFailed, showWarningModal, onWarningModalClose }: TextApiSpecImportProps) {
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState<string | undefined>();

    function onFormSubmit() {
        if (!text) {
            return;
        }
        setLoading(true);
        importApi(text, false);
    }

    const importApi = (text: string, skipDefaultServersRequirement: boolean) => {
        ApiSpecsApi.importApiSpecAsPlainText(text, skipDefaultServersRequirement)
            .then(response => {
                setLoading(false);
                if (response.status >= 200 && response.status < 300) {
                    response.json().then(data => {
                        setLoading(false);
                        onTextImportSucceeded('file', data.apiSpecId);
                    })
                } else {
                    response.json().then(function (error) {
                        onTextApiImportFailed(error)
                    })
                }
            })
            .catch(reason => {
                setLoading(false);
                onTextApiImportFailed({
                    title: reason.title,
                    detail: reason.message,
                    status: 400
                });
            });
    }

    const importApiWithoutDefaultServers = () => {
        onWarningModalClose();
        if (!text) {
            return;
        }
        setLoading(true);
        importApi(text, true);
    }

    const restrictedImportUrls = getRestrictedApiUrls();

    return (
        <>
            <FormControl>
                <FormLabel>Open Api file</FormLabel>
                <Textarea
                    required={true}
                    disabled={loading || restrictedImportUrls.length > 0}
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

            {restrictedImportUrls.length > 0 && <WarningAlert title="This a restricted demo instance of HopFront">
                <ReactMarkdown>
                    You can only import pre-determined URLs (not files) so you can quickly test HopFront.

                    If you want to test with your own files, you can easily start your own instance of HopFront
                    using [this Quick Start guide](https://hub.docker.com/r/hopfront/hopfront).
                </ReactMarkdown>
            </WarningAlert>}

            <Button
                onClick={onFormSubmit}
                disabled={loading || restrictedImportUrls.length > 0}
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