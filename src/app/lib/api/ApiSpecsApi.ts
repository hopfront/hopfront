import { ApiSpecImportRequestBody } from "@/app/lib/dto/ApiSpecImportRequestBody";
import { mutate } from "swr";

const mutateApiSpecList = () => {
    return mutate(`/api/api-specs`);
}

export class ApiSpecsApi {

    public static async importApiSpecAsUrl(url: string, skipSpecImportWarnings: boolean): Promise<string> {
        return fetch('/api/api-specs/imports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiSpecBaseUrl: url,
                skipSpecImportWarnings: skipSpecImportWarnings
            } as ApiSpecImportRequestBody)
        }).then(async response => {
            if (response.status >= 200 && response.status < 300) {
                await mutateApiSpecList();
                return response.json().then(data => {
                    return data['apiSpecId'];
                });
            } else {
                return response.json().then(problem => {
                    return Promise.reject(problem);
                });
            }
        });
    }

    public static async importApiSpecAsPlainText(text: string, skipSpecImportWarnings: boolean): Promise<string> {
        return fetch('/api/api-specs/imports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiSpecPlainText: text,
                skipSpecImportWarnings: skipSpecImportWarnings,
            } as ApiSpecImportRequestBody),
        }).then(async response => {
            if (response.status >= 200 && response.status < 300) {
                await mutateApiSpecList();
                return response.json().then(data => {
                    return data['apiSpecId'];
                });
            } else {
                return response.json().then(problem => {
                    return Promise.reject(problem);
                });
            }
        });
    }

    public static async deleteApiSpec(apiSpecId: string) {
        return fetch(`/api/api-specs/${apiSpecId}`, {
            method: 'DELETE',
        })
    }
}