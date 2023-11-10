import {ApiSpecImportRequestBody} from "@/app/lib/dto/ApiSpecImportRequestBody";
import {mutate} from "swr";

const mutateApiSpecList = () => {
    return mutate(`/api/api-specs`);
}

export class ApiSpecsApi {

    public static async importApiSpecAsUrl(url: string, skipNoDefaultServers: boolean) {
        return fetch('/api/api-specs/imports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiSpecBaseUrl: url,
                skipNoDefaultServers: skipNoDefaultServers
            } as ApiSpecImportRequestBody)
        }).then(async response => {
            await mutateApiSpecList();
            return response;
        });
    }

    public static async importApiSpecAsPlainText(text: string, skipNoDefaultServers: boolean) {
        return fetch('/api/api-specs/imports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiSpecPlainText: text,
                skipNoDefaultServers: skipNoDefaultServers,
            } as ApiSpecImportRequestBody),
        }).then(async response => {
            await mutateApiSpecList();
            return response;
        });
    }

    public static async deleteApiSpec(apiSpecId: string) {
        return fetch(`/api/api-specs/${apiSpecId}`, {
            method: 'DELETE',
        })
    }
}