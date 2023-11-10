import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ManualInput } from "@/app/components/input/ManualInput";
import { ApiSpecsApi } from "@/app/lib/api/ApiSpecsApi";
import { getRestrictedApiUrls } from "@/app/lib/openapi/utils";
import { FormHelperText } from "@mui/joy";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Option from '@mui/joy/Option';
import Select from "@mui/joy/Select";
import { ChangeEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ImportMode } from "./ImportApiSpec";
import SkipNoDefaultServersModal from "./SkipNoDefaultServersModal";

type UrlApiSpecImportProps = {
    onUrlImportSucceeded: (mode: ImportMode, apiSpecId: string) => void
    onUrlImportFailed: (error: any) => void
    showWarningModal: boolean
    onWarningModalClose: () => void
}

export default function UrlApiSpecImport({ onUrlImportSucceeded, onUrlImportFailed, showWarningModal, onWarningModalClose }: UrlApiSpecImportProps) {
    const [url, setUrl] = useState<string | undefined>('');
    const [isLoading, setLoading] = useState(false);

    function onFormSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!url) {
            return;
        }

        setLoading(true);
        importApi(url, false);
    }

    const importApi = (url: string, skipDefaultServersRequirement: boolean) => {
        ApiSpecsApi
            .importApiSpecAsUrl(url, skipDefaultServersRequirement)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    response.json().then(data => {
                        setLoading(false);
                        onUrlImportSucceeded('url', data.apiSpecId);
                    })
                } else {
                    setLoading(false);
                    response.json().then(function (error) {
                        onUrlImportFailed(error)
                    })
                }
            })
            .catch(reason => {
                setLoading(false);
                onUrlImportFailed({
                    title: reason.title,
                    detail: reason.message,
                    status: 400
                });
            });
    }

    const importApiWithoutDefaultServers = () => {
        onWarningModalClose();
        if (!url) {
            return;
        }
        setLoading(true);
        importApi(url, true);
    }

    const restrictedImportUrls = getRestrictedApiUrls();

    return (
        <>
            <form
                onSubmit={onFormSubmit}>
                <FormControl>
                    <FormLabel>OpenAPI Specification URL</FormLabel>
                    {restrictedImportUrls.length > 0
                        ? <Select
                            onChange={(_: any, value: any) => {
                                setUrl(value || undefined);
                            }}
                            defaultValue={restrictedImportUrls[0]}
                            value={url}>
                            {restrictedImportUrls.map(restrictedImportUrl =>
                                <Option
                                    key={restrictedImportUrl}
                                    value={restrictedImportUrl}>
                                    {restrictedImportUrl}
                                </Option>)}
                        </Select>
                        : <ManualInput
                            required={true}
                            type="url"
                            onChange={value => {
                                setUrl(value as string);
                            }}
                            placeholder="https://petstore3.swagger.io/api/v3/openapi.json" />}
                    <FormHelperText>The URL of your OpenAPI specification file (JSON or YAML).</FormHelperText>
                </FormControl>
                {restrictedImportUrls.length > 0 &&
                    <WarningAlert title="This a restricted demo instance of HopFront">
                        <ReactMarkdown>
                            {`We have restricted the URLs you can import to a 
                            few public ones so you can quickly test HopFront.  
                            If you want to test with your own URLs, you can 
                            easily start your own instance of HopFront using 
                            [this Quick Start guide](https://hub.docker.com/r/hopfront/hopfront).
                            `}
                        </ReactMarkdown>
                    </WarningAlert>}
                <Button
                    type="submit"
                    loading={isLoading}
                    loadingPosition='end'
                    sx={{ mt: 3 }}>
                    Import
                </Button>

                <SkipNoDefaultServersModal
                    showModal={showWarningModal}
                    onCancel={() => onWarningModalClose()}
                    onContinue={() => importApiWithoutDefaultServers()} />
            </form>
        </>
    )
};