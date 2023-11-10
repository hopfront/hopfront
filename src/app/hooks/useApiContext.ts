import { ApiContext } from "@/app/lib/model/ApiContext";
import useSWR from "swr";
import { fetcher } from "../lib/api/utils";

export const useApiContext = (apiSpecId: string | undefined) => {
    return useSWR<ApiContext>(apiSpecId ? `/api/api-specs/${apiSpecId}/context` : null, fetcher);
}