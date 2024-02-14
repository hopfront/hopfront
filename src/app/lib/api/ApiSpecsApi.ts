import {ApiSpecImportRequestBody} from "@/app/lib/dto/ApiSpecImportRequestBody";
import {mutate} from "swr";
import {ApiSpecUpdateRequestBody} from "../dto/ApiSpecUpdateRequestBody";

const mutateApiSpecList = () => {
    return mutate(`/api/api-specs`);
}

const initializeApiSpecExtension = (apiSpecId: string) => {
    return fetch(`/api/api-specs/${apiSpecId}/extension-initializations`, {
        method: 'POST',
    });
}

async function handleApiSPecImportResponse(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        await mutateApiSpecList();
        return response.json().then(data => {
            const apiSpecId = data['apiSpecId'];

            console.log(`Imported API spec with id=${apiSpecId}`);

            // We do this asynchronously to avoid blocking the user during this process.
            initializeApiSpecExtension(apiSpecId)
                .then(() => console.log(`Initialized extension for API spec with id=${apiSpecId}`));

            return apiSpecId;
        });
    } else {
        return response.json().then(problem => {
            return Promise.reject(problem);
        });
    }
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
        }).then(handleApiSPecImportResponse);
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
        }).then(handleApiSPecImportResponse);
    }

    public static async updateApiSpecByUrl(apiSpecId: string, url: string, skipSpecImportWarnings: boolean): Promise<string> {
        return fetch(`/api/api-specs/${apiSpecId}/updates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiSpecBaseUrl: url,
                skipSpecImportWarnings: skipSpecImportWarnings
            } as ApiSpecUpdateRequestBody)
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

    public static async updateApiSpecByPlainText(apiSpecId: string, text: string, skipSpecImportWarnings: boolean): Promise<string> {
        return fetch(`/api/api-specs/${apiSpecId}/updates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiSpecPlainText: text,
                skipSpecImportWarnings: skipSpecImportWarnings,
            } as ApiSpecUpdateRequestBody),
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