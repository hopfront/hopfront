import {mutate} from "swr";

export const fetcher = (url: string) => fetch(url).then(r => r.json())

export const mutateApiContext = async(apiSpecId: string) => {
    return mutate(`/api/api-specs/${apiSpecId}/context`);
}

export const extractErrorMessage = async (response: Response) => {
    let errorMessage = 'An unknown error occurred';
    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData)
    } catch (e) {
        console.log('Error parsing admin status error', e);
    }

    return errorMessage;
}