import {ManualInput} from "@/app/components/input/ManualInput";
import {ApiSpecsApi} from "@/app/lib/api/ApiSpecsApi";
import {FormHelperText} from "@mui/joy";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {ChangeEvent, useState} from "react";
import {ImportMode} from "./ImportApiSpec";
import SkipNoDefaultServersModal from "./SkipNoDefaultServersModal";
import {Problem} from "@/app/lib/dto/Problem";

type UrlApiSpecImportProps = {
    onUrlImportSucceeded: (mode: ImportMode, apiSpecId: string) => void
    onUrlImportFailed: (error: Problem) => void
    showWarningModal: boolean
    onWarningModalClose: () => void
    onLoading: (loading: boolean) => void
}

export default function UrlApiSpecImport({
                                             onUrlImportSucceeded,
                                             onUrlImportFailed,
                                             showWarningModal,
                                             onWarningModalClose,
                                             onLoading,
                                         }: UrlApiSpecImportProps) {
    const [url, setUrl] = useState<string | undefined>('');
    const [isLoading, setLoading] = useState(false);

    function onFormSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!url) {
            return;
        }

        importApi(url, false);
    }

    const importApi = (url: string, skipDefaultServersRequirement: boolean) => {
        setLoading(true);
        onLoading(true);

        ApiSpecsApi
            .importApiSpecAsUrl(url, skipDefaultServersRequirement)
            .then(apiSpecId => onUrlImportSucceeded('url', apiSpecId))
            .catch((problem: Problem) => onUrlImportFailed(problem))
            .finally(() => {
                setLoading(false);
                onLoading(false);
            });
    }

    const importApiWithoutDefaultServers = () => {
        onWarningModalClose();
        if (!url) {
            return;
        }

        importApi(url, true);
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
                        onChange={value => {
                            setUrl(value as string);
                        }}
                        placeholder="https://petstore3.swagger.io/api/v3/openapi.json"/>
                    <FormHelperText>The URL of your OpenAPI specification file (JSON or YAML).</FormHelperText>
                </FormControl>
                <Button
                    type="submit"
                    loading={isLoading}
                    loadingPosition='end'
                    sx={{mt: 3}}>
                    Import
                </Button>

                <SkipNoDefaultServersModal
                    showModal={showWarningModal}
                    onCancel={() => onWarningModalClose()}
                    onContinue={() => importApiWithoutDefaultServers()}/>
            </form>
        </>
    )
};