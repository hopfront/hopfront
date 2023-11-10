import { ApiSpecListResponseBody } from "@/app/api/api-specs/route";
import useSWR, { SWRResponse } from "swr";
import {fetcher} from "@/app/lib/api/utils";

export function useApiSpecs(): SWRResponse<ApiSpecListResponseBody> {
    return useSWR<ApiSpecListResponseBody>(`/api/api-specs`, fetcher);
}