import {mutate} from "swr";

export const fetcher = (url: string) => fetch(url).then(r => r.json())

export const mutateApiContext = async(apiSpecId: string) => {
    return mutate(`/api/api-specs/${apiSpecId}/context`);
}