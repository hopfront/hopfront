import useSWR, { mutate } from "swr";
import { fetcher } from "../lib/api/utils";
import { InstanceAdminInfoResponse } from "../lib/dto/InstanceAdminInfoResponse";

export const mutateAdminInfo = () => {
    return mutate(`/api/instance/admin/info`);
}

export default function useAdminInfo() {
    return useSWR<InstanceAdminInfoResponse>('/api/instance/admin/info', fetcher);
}